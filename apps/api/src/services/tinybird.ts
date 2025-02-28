import type { Analytics } from "@pollify/types";
import { z } from "zod";

import tinybird from "../lib/tinybird";

export const sendPollVoteData = tinybird.buildIngestEndpoint({
  datasource: "analytics_poll_vote__v1",
  event: z.object({
    vote_id: z.string(),
    user_id: z.string().optional().default("Unknown"),
    owner_id: z.string().optional().default("Unknown"),
    poll_id: z.string(),
    answer_id: z.string(),
    timestamp: z.string(),
    browser: z.string().optional().default("Unknown"),
    browser_version: z.string().optional().default("Unknown"),
    os: z.string().optional().default("Unknown"),
    os_version: z.string().optional().default("Unknown"),
    device: z.string().optional().default("desktop"),
    device_vendor: z.string().optional().default("Unknown"),
    device_model: z.string().optional().default("Unknown"),
    region: z.string().optional().default("Unknown"),
    country_code: z.string().optional().default("Unknown"),
    country_name: z.string().optional().default("Unknown"),
    latitude: z.number().optional().default(0.01),
    longitude: z.number().optional().default(0.01),
  }),
});

const parametersSchema = z.object({
  owner_id: z.string(),
  limit: z.number().positive().optional(),
  date_from: z.number().positive().optional(),
  date_to: z.number().positive().optional(),
  poll_id: z.string().optional(),
});

const pollVotesPipe = tinybird.buildPipe({
  pipe: process.env.TINYBIRD_PIPE_USER_ALL_VOTES_ID as string,
  parameters: parametersSchema.extend({
    group_by: z.enum<string, [Analytics.GroupBy, ...Analytics.GroupBy[]]>([
      "minute",
      "hour",
      "day",
      "month",
    ]),
  }),
  data: z.object({
    timestamp: z.number(),
    total: z.number().positive(),
  }),
});

const topDevicesPipe = tinybird.buildPipe({
  pipe: process.env.TINYBIRD_PIPE_USER_TOP_DEVICES_ID as string,
  parameters: parametersSchema,
  data: z.object({
    device: z.enum(["desktop", "mobile", "tablet"]),
    total: z.number().positive(),
  }),
});

const topCountriesPipe = tinybird.buildPipe({
  pipe: process.env.TINYBIRD_PIPE_USER_TOP_COUNTRIES_ID as string,
  parameters: parametersSchema,
  data: z.object({
    country_name: z.string(),
    country_code: z.string(),
    total: z.number().positive(),
  }),
});

export const getPollVotesAnalytics = async (
  params: Analytics.AnalyticsParams<{
    groupBy: Analytics.GroupBy;
  }>
) => {
  const response = await pollVotesPipe({
    poll_id: params.pollId,
    group_by: params.groupBy,
    ...transformParamsToSnakeCase(params),
  });
  return response.data;
};

export const getPollDevicesAnalytics = async (
  params: Analytics.AnalyticsParams<Record<string, unknown>>
) => {
  const response = await topDevicesPipe({
    poll_id: params.pollId,
    ...transformParamsToSnakeCase(params),
  });
  const data = {
    mobile: response.data.find((d) => d.device === "mobile")?.total || 0,
    tablet: response.data.find((d) => d.device === "tablet")?.total || 0,
    desktop: response.data.find((d) => d.device === "desktop")?.total || 0,
  };

  const sortedData = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {}) as typeof data;
  return sortedData;
};

export const getPollCountriesAnalytics = async (
  params: Analytics.AnalyticsParams<Record<string, unknown>>
) => {
  const response = await topCountriesPipe({
    poll_id: params.pollId,
    ...transformParamsToSnakeCase(params),
  });
  const data = response.data.filter(
    (countryData) => countryData.country_code.length === 2
  );
  return data;
};

function transformParamsToSnakeCase(params: Analytics.AnalyticsParams) {
  return {
    owner_id: params.ownerId,
    date_from: params.dateFrom,
    date_to: params.dateTo,
    limit: params.limit,
  };
}
