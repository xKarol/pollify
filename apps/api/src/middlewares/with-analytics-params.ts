import type { Analytics } from "@pollify/types";
import dayjs from "dayjs";
import { createMiddleware } from "hono/factory";
import type { z } from "zod";

import * as AnalyticsSchema from "../schemas/analytics";

const groupByName = {
  h: "hour",
  d: "day",
  m: "month",
  y: "year",
} as const;

export const withAnalyticsParams = createMiddleware<{
  Variables: {
    analytics: z.infer<typeof AnalyticsSchema.defaultQueryParams> & {
      groupBy: Analytics.GroupBy;
    };
  };
}>(async (c, next) => {
  const {
    interval,
    limit = 50,
    dateTo = dayjs().unix(),
    dateFrom,
  } = AnalyticsSchema.defaultQueryParams.parse(c.req.query());

  const [value, unit] = interval;
  const fullInterval = `${value}${unit}`;

  const getGroupBy = (interval: string): Analytics.GroupBy => {
    if (interval === "1h") return "minute";
    if (interval === "1y") return "month";
    // @ts-expect-error
    return groupByName[unit];
  };

  c.set("analytics", {
    interval,
    groupBy: getGroupBy(fullInterval),
    dateFrom: dateFrom || dayjs().subtract(value, groupByName[unit]).unix(),
    dateTo,
    limit,
  });

  return next();
});
