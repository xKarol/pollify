import { zValidator } from "@hono/zod-validator";
import { apiUrls } from "@pollify/config";
import { hasUserPermission } from "@pollify/lib";
import type { Plan } from "@pollifyify/prisma/client";
import dayjs from "dayjs";
import { Hono } from "hono";
import httpError from "http-errors";
import { z } from "zod";

import { requireAuth } from "../middlewares/require-auth";
import { withAnalyticsParams } from "../middlewares/with-analytics-params";
import { withAuth } from "../middlewares/with-auth";
import {
  getUserPollTopCountries,
  getUserPollTopDevices,
  getUserPollVotesData,
} from "../services/tinybird";

const analytics = new Hono()
  .get(
    apiUrls.analytics.userPollVotes,
    withAuth,
    requireAuth,
    zValidator("query", z.object({ pollId: z.string().optional() })),
    withAnalyticsParams,
    async (c) => {
      const params = c.get("analytics");
      const { pollId } = c.req.valid("query");
      const { session: user } = c.get("user");

      checkPermissions(params.dateFrom, params.dateTo, user.plan);

      const { data } = await getUserPollVotesData({
        pollId,
        ownerId: user.id,
        ...params,
      });
      return c.json(data);
    }
  )
  .get(
    apiUrls.analytics.getUserPollTopDevices,
    withAuth,
    requireAuth,
    zValidator("query", z.object({ pollId: z.string().optional() })),
    withAnalyticsParams,
    async (c) => {
      const params = c.get("analytics");
      const { pollId } = c.req.valid("query");
      const { session: user } = c.get("user");

      checkPermissions(params.dateFrom, params.dateTo, user.plan);

      const { data: rawData } = await getUserPollTopDevices({
        pollId,
        ownerId: user.id,
        ...params,
      });

      const data = {
        mobile: rawData.find((d) => d.device === "mobile")?.total || 0,
        tablet: rawData.find((d) => d.device === "tablet")?.total || 0,
        desktop: rawData.find((d) => d.device === "desktop")?.total || 0,
      };

      const sortedData = Object.entries(data)
        .sort(([, a], [, b]) => b - a)
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {}) as typeof data;

      return c.json(sortedData);
    }
  )
  .get(
    apiUrls.analytics.getUserPollTopCountries,
    withAuth,
    requireAuth,
    zValidator("query", z.object({ pollId: z.string().optional() })),
    withAnalyticsParams,
    async (c) => {
      const params = c.get("analytics");
      const { pollId } = c.req.valid("query");
      const { session: user } = c.get("user");

      checkPermissions(params.dateFrom, params.dateTo, user.plan);

      const { data: rawData } = await getUserPollTopCountries({
        pollId,
        ownerId: user.id,
        ...params,
      });

      const data = rawData.filter(
        (countryData) => countryData.country_code.length === 2
      );

      return c.json(data);
    }
  );

function checkPermissions(dateFrom: number, dateTo: number, plan: Plan) {
  if (
    dayjs(dateTo).diff(dateFrom, "year") >= 1 &&
    !hasUserPermission("BASIC", plan)
  ) {
    throw httpError.Forbidden("Basic plan or higher is required.");
  }
}

export default analytics;
