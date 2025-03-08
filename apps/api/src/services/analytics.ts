import type { Analytics } from "@pollify/types";
import { mean, median, standardDeviation, variance } from "simple-statistics";
import { z } from "zod";

import tinybird from "../lib/tinybird";

// tinybird schemas
export const sendPollVoteData = tinybird.buildIngestEndpoint({
  datasource: "analytics_poll_vote__v1",
  event: z.object({
    vote_id: z.string(),
    user_id: z.string().optional().default("Unknown"),
    owner_id: z.string().optional().default("Unknown"),
    poll_id: z.string(),
    answer_id: z.string(),
    timestamp: z.string(),
    browser: z.string().default("Unknown"),
    browser_version: z.string().default("Unknown"),
    ua: z.string().default("Unknown"),
    os: z.string().default("Unknown"),
    os_version: z.string().default("Unknown"),
    device: z.string().default("desktop"),
    device_vendor: z.string().default("Unknown"),
    device_model: z.string().default("Unknown"),
    region: z.string().default("Unknown"),
    country_code: z.string().default("Unknown"),
    country_name: z.string().default("Unknown"),
    latitude: z.number().default(0.01),
    longitude: z.number().default(0.01),
  }),
});

const parametersSchema = z.object({
  owner_id: z.string(),
  limit: z.number().positive().optional(),
  date_from: z.number().positive().optional(),
  date_to: z.number().positive().optional(),
  poll_id: z.string().optional(),
  group_by: z
    .enum<string, [Analytics.GroupBy, ...Analytics.GroupBy[]]>([
      "minute",
      "hour",
      "day",
      "month",
    ])
    .optional(),
});

const votesPipe = tinybird.buildPipe({
  pipe: process.env.TINYBIRD_VOTES_PIPE_ID!,
  parameters: parametersSchema,
  data: z.object({
    amount: z.number().positive(),
    date: z.string(),
  }),
});

const devicesPipe = tinybird.buildPipe({
  pipe: process.env.TINYBIRD_DEVICES_PIPE_ID!,
  parameters: parametersSchema,
  data: z.object({
    device_name: z.enum(["desktop", "mobile", "tablet"]),
    amount: z.number().positive(),
    date: z.string(),
  }),
});

const countriesPipe = tinybird.buildPipe({
  pipe: process.env.TINYBIRD_COUNTRIES_PIPE_ID!,
  parameters: parametersSchema,
  data: z.object({
    country_name: z.string(),
    country_code: z.string(),
    amount: z.number().positive(),
    date: z.string(),
  }),
});

const browsersPipe = tinybird.buildPipe({
  pipe: process.env.TINYBIRD_BROWSERS_PIPE_ID!,
  parameters: parametersSchema,
  data: z.object({
    browser_name: z.string(),
    browser_version: z.string(),
    amount: z.number().positive(),
    date: z.string(),
  }),
});

// services
export const getVotesAnalytics = async (
  params: Analytics.AnalyticsParams<{
    groupBy: Analytics.GroupBy;
  }>
) => getAnalytics(votesPipe, params);

export const getDevicesAnalytics = async (
  params: Analytics.AnalyticsParams<Record<string, unknown>>
) => getAnalytics(devicesPipe, params);

export const getCountriesAnalytics = async (
  params: Analytics.AnalyticsParams<Record<string, unknown>>
) => getAnalytics(countriesPipe, params);

export const getBrowsersAnalytics = async (
  params: Analytics.AnalyticsParams<Record<string, unknown>>
) => getAnalytics(browsersPipe, params);

// utils
async function getAnalytics<
  T extends (...args: any[]) => Promise<{ data: any }>,
>(
  pipe: T,
  params: Analytics.AnalyticsParams<Record<string, unknown>>
): Promise<{
  data: Awaited<ReturnType<T>>["data"];
  total: number;
  metrics: Omit<ReturnType<typeof getAnalyticsMetrics>, "total">;
  meta: typeof params;
}> {
  const response = await pipe(transformParamsToSnakeCase(params));
  const { total, ...metrics } = getAnalyticsMetrics(response.data);
  return {
    data: response.data,
    total,
    metrics,
    meta: params,
  };
}

function getAnalyticsMetrics(data: { amount: number; [x: string]: unknown }[]) {
  const total = data.reduce((sum, current) => sum + current.amount, 0);
  const totals = data.map((item) => item.amount);

  const safe = <T>(fn: () => T) => {
    try {
      const response = fn();
      if (!Number.isFinite(response)) throw undefined;
      return response;
    } catch {
      return undefined;
    }
  };

  return {
    total,
    min: safe(() => Math.min(...totals)) ?? 0,
    max: safe(() => Math.max(...totals)) ?? 0,
    average: safe(() => mean(totals)) ?? 0,
    median: safe(() => median(totals)),
    range: safe(() => Math.max(...totals) - Math.min(...totals)),
    variance: safe(() => variance(totals)),
    standardDeviation: safe(() => standardDeviation(totals)),
  };
}

function transformParamsToSnakeCase(params: Analytics.AnalyticsParams) {
  return {
    owner_id: params.ownerId,
    poll_id: params.pollId,
    date_from: params.dateFrom,
    date_to: params.dateTo,
    limit: params.limit,
    group_by: params.groupBy,
  };
}
