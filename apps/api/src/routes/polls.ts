import { zValidator } from "@hono/zod-validator";
import { apiUrls } from "@pollify/config";
import { hasUserPermission } from "@pollify/lib";
import prisma from "@pollify/prisma/edge";
import type { Poll } from "@pollify/types";
import { PollValidator } from "@pollify/validations";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import httpError from "http-errors";
import { z } from "zod";

import { getGeoData } from "../lib/geoip";
import { redis } from "../lib/redis";
import { ua } from "../lib/useragent";
import { withAuth } from "../middlewares/with-auth";
import { withCache } from "../middlewares/with-cache";
import { withPagination } from "../middlewares/with-pagination";
import { withSorting } from "../middlewares/with-sorting";
import {
  getPolls,
  getPoll,
  createPoll,
  deletePoll,
  votePoll,
  getPollVoters,
  getPollUserAnswerChoice,
} from "../services/polls";
import { verifyReCaptcha } from "../services/recaptcha";
import * as Analytics from "../services/tinybird";
import { getIP } from "../utils/get-ip";

const polls = new Hono()
  .get(
    apiUrls.poll.getOne(":pollId"),
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
    apiUrls.poll.getLiveResults(":pollId"),
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

          if (data === null) {
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
    apiUrls.poll.getAll,
    withPagination,
    withSorting<Poll.SortPollFields>({
      allowedFields: ["createdAt", "totalVotes"],
      defaultField: "createdAt",
    }),
    withCache(60 * 5),
    async (c) => {
      const { page, limit, skip } = c.get("pagination");
      const { sortBy, orderBy } = c.get("sorting");
      const data = await getPolls({ page, limit, skip, sortBy, orderBy });

      return c.json(data);
    }
  )
  .post(
    apiUrls.poll.create,
    withAuth,
    zValidator("json", PollValidator.createPollSchema),
    async (c) => {
      const payload = c.req.valid("json");
      const { isLoggedIn, session: user } = c.get("user");
      const userPlan = isLoggedIn ? user.plan : "FREE";

      if (payload?.requireRecaptcha === true) {
        const hasPermission = hasUserPermission("BASIC", userPlan);
        if (!hasPermission)
          throw httpError.Forbidden(
            "Basic plan or higher is required to use reCAPTCHA option."
          );
      }

      if (payload.answers.length > 6) {
        const hasPermission = hasUserPermission("BASIC", userPlan);
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
    apiUrls.poll.delete(":pollId"),
    zValidator("param", z.object({ pollId: z.string() })),
    async (c) => {
      const { pollId } = c.req.valid("param");
      await deletePoll(pollId);

      return c.status(200);
    }
  )
  .post(
    apiUrls.poll.vote(":pollId", ":answerId"),
    zValidator("param", z.object({ pollId: z.string(), answerId: z.string() })),
    zValidator("json", z.object({ reCaptchaToken: z.string() })),
    withAuth,
    async (c) => {
      const { pollId, answerId } = c.req.valid("param");
      const { reCaptchaToken } = c.req.valid("json");
      const { session: user } = c.get("user");

      const poll = await prisma.poll.findUnique({
        where: { id: pollId },
        select: { requireRecaptcha: true, userId: true },
      });

      if (!poll) {
        throw httpError.NotFound();
      }

      if (poll.requireRecaptcha) {
        const { success } = await verifyReCaptcha(reCaptchaToken);
        if (!success) throw new Error("Invalid reCAPTCHA verification.");
      }

      const vote = await votePoll({ userId: user?.id, pollId, answerId });

      const ip = getIP(c.req);
      const geo = await getGeoData(ip!).catch(() => null);
      const userAgent = c.req.header("user-agent") || "";
      ua.setUA(userAgent).getResult();

      // await Promise.all([
      //   redis.del(apiUrls.poll.getOne(pollId)),
      //   redis.del(apiUrls.poll.getVoters(pollId)),
      // ]).catch(() => null);

      await Analytics.sendPollVoteData({
        user_id: user?.id,
        poll_id: pollId,
        owner_id: poll.userId || undefined,
        vote_id: vote.id,
        answer_id: answerId,
        timestamp: new Date().toISOString(),
        browser: ua.getBrowser().name,
        browser_version: ua.getBrowser().version,
        os: ua.getOS().name,
        os_version: ua.getOS().version,
        device: ua.getDevice().type,
        device_model: ua.getDevice().model,
        device_vendor: ua.getDevice().vendor,
        country_code: geo?.country_code,
        country_name: geo?.country_name,
        latitude: geo?.latitude,
        longitude: geo?.longitude,
        region: geo?.region,
      }).catch((e) => {
        // TODO use logger here
        console.log("Vote Analytics error:", e);
        return null;
      });

      return c.json(vote);
    }
  )
  .get(
    apiUrls.poll.getVoters(":pollId"),
    zValidator("param", z.object({ pollId: z.string() })),
    withCache(60 * 5), // 1 hour
    async (c) => {
      const { pollId } = c.req.valid("param");
      const data = await getPollVoters(pollId);

      return c.json(data);
    }
  )
  .get(
    apiUrls.poll.getUserAnswerChoice(":pollId"),
    zValidator("param", z.object({ pollId: z.string() })),
    withAuth,
    withCache(60 * 60 * 12, { requireUser: true }), //12 hours
    async (c) => {
      const { pollId } = c.req.valid("param");
      const { isLoggedIn, session: user } = c.get("user");

      if (!isLoggedIn) return c.json({}); //TODO check if this is correct
      const data = await getPollUserAnswerChoice(user.id, pollId);

      if (!data) return c.json({}); //TODO check if this is correct
      return c.json(data);
    }
  );

export default polls;
