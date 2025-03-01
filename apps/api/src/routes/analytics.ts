import { Parser } from "@json2csv/plainjs";
import { apiUrls } from "@pollify/config";
import type { Plans } from "@pollify/db/types";
import { hasUserPermission } from "@pollify/lib";
import dayjs from "dayjs";
import { Hono } from "hono/quick";
import httpError from "http-errors";
import { z } from "zod";

import { requireAuth } from "../middlewares/require-auth";
import { zValidator } from "../middlewares/validator";
import { withAnalyticsParams } from "../middlewares/with-analytics-params";
import { withAuth } from "../middlewares/with-auth";
import {
  getPollCountriesAnalytics,
  getPollDevicesAnalytics,
  getPollVotesAnalytics,
} from "../services/tinybird";

const analytics = new Hono()
  .get(
    apiUrls.polls.analytics.getVotes,
    withAuth,
    requireAuth,
    zValidator("query", z.object({ pollId: z.string().optional() })),
    withAnalyticsParams,
    async (c) => {
      const { pollId } = c.req.valid("query");
      const analytics = c.get("analytics");
      const { session: user } = c.get("user");

      checkPermissions(analytics.dateFrom, analytics.dateTo, user.plan);

      const data = await getPollVotesAnalytics({
        pollId,
        ownerId: user.id,
        ...analytics,
      });
      return c.json(data);
    }
  )
  .get(
    apiUrls.polls.analytics.getDevices,
    withAuth,
    requireAuth,
    zValidator("query", z.object({ pollId: z.string().optional() })),
    withAnalyticsParams,
    async (c) => {
      const { pollId } = c.req.valid("query");
      const analytics = c.get("analytics");
      const { session: user } = c.get("user");

      checkPermissions(analytics.dateFrom, analytics.dateTo, user.plan);

      const data = await getPollDevicesAnalytics({
        pollId,
        ownerId: user.id,
        ...analytics,
      });

      return c.json(data);
    }
  )
  .get(
    apiUrls.polls.analytics.getCountries,
    withAuth,
    requireAuth,
    zValidator("query", z.object({ pollId: z.string().optional() })),
    withAnalyticsParams,
    async (c) => {
      const { pollId } = c.req.valid("query");
      const analytics = c.get("analytics");
      const { session: user } = c.get("user");

      checkPermissions(analytics.dateFrom, analytics.dateTo, user.plan);

      const data = await getPollCountriesAnalytics({
        pollId,
        ownerId: user.id,
        ...analytics,
      });

      return c.json(data);
    }
  )
  .get(
    apiUrls.polls.analytics.export,
    withAuth,
    requireAuth,
    zValidator("query", z.object({ pollId: z.string().optional() })),
    zValidator(
      "query",
      z.object({
        type: z
          .enum(["all", "devices", "countries", "votes"])
          .optional()
          .default("all"),
        format: z.enum(["csv", "json"]).optional().default("csv"),
      })
    ),
    withAnalyticsParams,
    async (c) => {
      const { pollId, type, format } = c.req.valid("query");
      const analytics = c.get("analytics");
      const { session: user } = c.get("user");
      const fileName = `analytics${
        pollId ? `_${pollId}` : ""
      }_${type}.${format}`;

      checkPermissions(analytics.dateFrom, analytics.dateTo, user.plan);

      let data: unknown = undefined;
      switch (type) {
        case "votes": {
          data = await getPollVotesAnalytics({
            pollId,
            ownerId: user.id,
            ...analytics,
          });
          break;
        }
        case "devices": {
          data = await getPollDevicesAnalytics({
            pollId,
            ownerId: user.id,
            ...analytics,
          });
          break;
        }
        case "countries": {
          data = await getPollCountriesAnalytics({
            pollId,
            ownerId: user.id,
            ...analytics,
          });
          break;
        }
      }

      if (
        !data ||
        (Array.isArray(data)
          ? data.length === 0
          : Object.keys(data || {}).length === 0)
      ) {
        throw httpError("No available data to export.");
      }

      switch (format) {
        case "csv": {
          const parser = new Parser();
          data = parser.parse(Array.isArray(data) ? data : [data]);
        }
      }

      c.header("Content-Disposition", `attachment; filename="${fileName}"`);
      // @ts-expect-error
      return c.json(data);
    }
  );

function checkPermissions(dateFrom: number, dateTo: number, plan: Plans) {
  if (
    dayjs(dateTo).diff(dateFrom, "year") >= 1 &&
    !hasUserPermission("basic", plan)
  ) {
    throw httpError.Forbidden("Basic plan or higher is required.");
  }
}

export default analytics;
