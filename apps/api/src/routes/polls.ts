import { zValidator } from "@hono/zod-validator";
import { apiUrls } from "@poll/config";
import { hasUserPermission } from "@poll/lib";
import prisma from "@poll/prisma/edge";
import type { Poll } from "@poll/types";
import { PollValidator } from "@poll/validators";
import { Hono } from "hono";
import httpError from "http-errors";
import { z } from "zod";

import type { App } from "..";
import { getGeoData } from "../lib/geoip";
// import redis from "../lib/redis";
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

const polls: App = new Hono();

polls.get(
  apiUrls.poll.getOne(":pollId"),
  zValidator("param", z.object({ pollId: z.string().nonempty() })),
  // withCache(60 * 30),
  async (c) => {
    const { pollId } = c.req.valid("param");

    const data = await getPoll(pollId);
    // await c.var.cache.set(data);
    return c.json(data);
  }
);

polls.get(
  apiUrls.poll.getAll,
  withPagination,
  withSorting<Poll.SortPollFields>({
    allowedFields: ["createdAt", "totalVotes"],
    defaultField: "createdAt",
  }),
  // withCache(60 * 30),
  async (c) => {
    const { page, limit, skip } = c.get("pagination");
    const { sortBy, orderBy } = c.get("sorting");
    const data = await getPolls({ page, limit, skip, sortBy, orderBy });
    // await c.var.cache.set(data);

    return c.json(data);
  }
);

polls.post(
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
          "Basic plan or higher is required to use reCAPTCHA."
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
);

polls.delete(
  apiUrls.poll.delete(":pollId"),
  zValidator("param", z.object({ pollId: z.string() })),
  async (c) => {
    const { pollId } = c.req.valid("param");
    await deletePoll(pollId);

    return c.status(200);
  }
);

polls.post(
  apiUrls.poll.vote(":pollId", ":answerId"),
  zValidator("param", z.object({ pollId: z.string(), answerId: z.string() })),
  zValidator("json", z.object({ reCaptchaToken: z.string() })),
  withAuth,
  async (c) => {
    const { pollId, answerId } = c.req.valid("param");
    const { reCaptchaToken } = c.req.valid("json");
    const { session: user } = c.get("user");

    const { requireRecaptcha: isReCaptchaRequired, userId: ownerId } =
      await prisma.poll.findUniqueOrThrow({
        where: { id: pollId },
        select: { requireRecaptcha: true, userId: true },
      });
    if (isReCaptchaRequired) {
      const { success: isValidCaptcha } = await verifyReCaptcha(reCaptchaToken);
      if (!isValidCaptcha) throw new Error("Invalid reCAPTCHA verification.");
    }

    const data = await votePoll({ userId: user?.id, pollId, answerId });

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
      owner_id: ownerId || undefined,
      vote_id: data.id,
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
      console.log("Vote Analytics error:", e);
      return null;
    });

    return c.json(data);
  }
);

polls.get(
  apiUrls.poll.getVoters(":pollId"),
  zValidator("param", z.object({ pollId: z.string() })),
  // withCache(60 * 60), // 1 hour
  async (c) => {
    const { pollId } = c.req.valid("param");
    const data = await getPollVoters(pollId);
    // await c.var.cache.set(data);

    return c.json(data);
  }
);

polls.get(
  apiUrls.poll.getUserAnswerChoice(":pollId"),
  zValidator("param", z.object({ pollId: z.string() })),
  withAuth,
  // withCache(60 * 60 * 12, { requireUser: true }), //12 hours
  async (c) => {
    const { pollId } = c.req.valid("param");
    const { isLoggedIn, session: user } = c.get("user");

    if (!isLoggedIn) return c.json({}); //TODO check if this is correct
    const data = await getPollUserAnswerChoice(user.id, pollId);
    if (data) {
      // await c.var.cache.set(data);
    }

    if (!data) return c.json({}); //TODO check if this is correct
    return c.json(data);
  }
);

export default polls;
