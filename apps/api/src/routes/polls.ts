import { apiUrls } from "@pollify/config";
import { db } from "@pollify/db/edge";
import { type Answer } from "@pollify/db/types";
import { hasUserPermission } from "@pollify/lib";
import type { Poll } from "@pollify/types";
import { PollValidator } from "@pollify/validations";
import { Hono } from "hono/quick";
import { streamSSE } from "hono/streaming";
import httpError from "http-errors";
import { z } from "zod";

import { getGeoData } from "../lib/geoip";
import { redis } from "../lib/redis";
import { ua } from "../lib/useragent";
import { zValidator } from "../middlewares/validator";
import { withAuth } from "../middlewares/with-auth";
import { withCache } from "../middlewares/with-cache";
import { withPagination } from "../middlewares/with-pagination";
import { withSorting } from "../middlewares/with-sorting";
import * as Analytics from "../services/analytics";
import {
  getPollList,
  getPoll,
  createPoll,
  deletePoll,
  votePoll,
  getPollVoters,
  getPollUserSelection,
  getPollAnswer,
} from "../services/polls";
import { verifyReCaptcha } from "../services/recaptcha";
import { getIP } from "../utils/get-ip";

const polls = new Hono()
  .get(
    apiUrls.polls.getOne(":pollId"),
    zValidator("param", z.object({ pollId: z.string().nonempty() })),
    // withCache(60 * 30),
    async (c) => {
      const { pollId } = c.req.valid("param");

      const data = await getPoll(pollId);

      if (!data) {
        throw httpError.NotFound();
      }
      return c.json(data);
    }
  )
  .get(
    apiUrls.polls.getLiveResults(":pollId"),
    zValidator("param", z.object({ pollId: z.string().nonempty() })),
    async (c) => {
      const { pollId } = c.req.valid("param");
      let lastSentData: unknown;

      return streamSSE(c, async (stream) => {
        while (true) {
          // TODO check if user voted
          const cacheKey = `poll:${pollId}:live-results`;
          const cacheData =
            await redis.get<Awaited<ReturnType<typeof getPoll>>>(cacheKey);

          const data = cacheData ? cacheData : await getPoll(pollId);

          if (!data) {
            throw httpError.NotFound();
          }

          if (!cacheData) {
            await redis.set(cacheKey, data, {
              ex: 6,
            });
          }

          const dataString = JSON.stringify(data);
          // send only when data changed
          if (dataString !== lastSentData) {
            await stream.writeSSE({
              data: dataString,
              id: data.id,
            });

            lastSentData = dataString;
          }

          await stream.sleep(5000); // update every 5s
        }
      });
    }
  )
  .get(
    apiUrls.polls.getAll,
    withPagination,
    withSorting<Poll.SortPollFields>({
      allowedFields: ["createdAt", "totalVotes"],
      defaultField: "createdAt",
    }),
    withCache(60 * 5),
    async (c) => {
      const { page, limit, skip } = c.get("pagination");
      const { sortBy, orderBy } = c.get("sorting");
      const data = await getPollList({ page, limit, skip, sortBy, orderBy });

      return c.json(data);
    }
  )
  .post(
    apiUrls.polls.create,
    withAuth,
    zValidator("json", PollValidator.createPollSchema),
    async (c) => {
      const payload = c.req.valid("json");
      const { isLoggedIn, session: user } = c.get("user");
      const userPlan = isLoggedIn ? user.plan : "free";

      if (payload?.requireRecaptcha === true) {
        const hasPermission = hasUserPermission("basic", userPlan);
        if (!hasPermission)
          throw httpError.Forbidden(
            "Basic plan or higher is required to use reCAPTCHA option."
          );
      }

      if (payload.answers.length > 6) {
        const hasPermission = hasUserPermission("basic", userPlan);
        if (!hasPermission)
          throw httpError.Forbidden(
            "Basic plan or higher is required to create more than 6 answers."
          );
      }

      const poll = await createPoll({
        ...payload,
        userId: user?.id,
      });

      return c.json(poll);
    }
  )
  .delete(
    apiUrls.polls.delete(":pollId"),
    zValidator("param", z.object({ pollId: z.string() })),
    async (c) => {
      const { pollId } = c.req.valid("param");
      await deletePoll(pollId);
      // TODO remove cache
      return c.json({});
    }
  )
  .post(
    apiUrls.polls.vote(":pollId", ":answerId"),
    zValidator("param", z.object({ pollId: z.string(), answerId: z.string() })),
    zValidator("json", z.object({ reCaptchaToken: z.string().optional() })),
    withAuth,
    async (c) => {
      const { pollId, answerId } = c.req.valid("param");
      const { reCaptchaToken } = c.req.valid("json");
      const { session: user } = c.get("user");

      const data = await db.query.polls.findFirst({
        where: (polls, { eq }) => eq(polls.id, pollId),
        columns: {
          requireRecaptcha: true,
          userId: true,
        },
      });

      if (!data) {
        throw httpError.NotFound();
      }

      if (data.requireRecaptcha) {
        const { success } = await verifyReCaptcha(reCaptchaToken!);
        if (!success) throw new Error("Invalid reCAPTCHA verification.");
      }

      const vote = await votePoll({ userId: user?.id, pollId, answerId });

      const ip = getIP(c.req);
      const geo = await getGeoData(ip!).catch(() => undefined);
      const userAgent = c.req.header("user-agent") || "";
      ua.setUA(userAgent).getResult();

      // await Promise.all([
      //   redis.del(apiUrls.poll.getOne(pollId)),
      //   redis.del(apiUrls.poll.getVoters(pollId)),
      // ]).catch(() => null);

      await Analytics.sendPollVoteData({
        user_id: user?.id,
        poll_id: pollId,
        owner_id: data.userId || undefined,
        vote_id: vote.id,
        answer_id: answerId,
        timestamp: new Date().toISOString(),
        ua: userAgent,
        browser: ua.getBrowser().name,
        browser_version: ua.getBrowser().version,
        os: ua.getOS().name,
        os_version: ua.getOS().version,
        device: ua.getDevice().type,
        device_model: ua.getDevice().model,
        device_vendor: ua.getDevice().vendor,
        country_name: geo?.country,
        country_code: geo?.countryCode,
        latitude: geo?.lat,
        longitude: geo?.lon,
        region: geo?.region,
      }).catch((e) => {
        // TODO use logger here
        console.log("Vote Analytics error:", e);
        return null;
      });

      // set the selected vote based on ip for users who are not logged in
      await redis.set(`${pollId}:${ip}`, answerId);

      return c.json(vote);
    }
  )
  .get(
    apiUrls.polls.getVoters(":pollId"),
    zValidator("param", z.object({ pollId: z.string() })),
    withCache(60 * 5), // 1 hour
    async (c) => {
      const { pollId } = c.req.valid("param");
      const data = await getPollVoters(pollId);

      return c.json(data);
    }
  )
  .get(
    apiUrls.polls.getUserSelection(":pollId"),
    zValidator("param", z.object({ pollId: z.string() })),
    withAuth,
    withCache(60 * 60 * 12, { requireUser: true }), //12 hours
    async (c) => {
      const { pollId } = c.req.valid("param");
      const { isLoggedIn, session: user } = c.get("user");
      let answer: Answer | undefined = undefined;

      if (isLoggedIn) {
        answer = await getPollUserSelection(user.id, pollId);
      } else {
        const ip = getIP(c.req);
        const answerId = await redis.get<string>(`${pollId}:${ip}`);

        if (answerId) {
          answer = (await getPollAnswer(answerId)) || undefined;
        }
      }

      return c.json({ answer });
    }
  );

export default polls;
