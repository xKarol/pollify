import type { Analytics } from "@pollify/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { client } from "../../../services/api";
import type { HookQueryOptions } from "../../../types";

const $get = client.api.polls.analytics.browsers.$get;

export const getUserPollBrowsersKey = ({
  interval,
  pollId,
}: Analytics.ClientAnalyticsParams) =>
  ["analytics.browsers", { interval, pollId }] as const;

export const getUserPollBrowsersOptions = (
  params: Analytics.ClientAnalyticsParams,
  options?: HookQueryOptions<typeof $get>
) => {
  return queryOptions({
    ...options,
    queryKey: getUserPollBrowsersKey({
      interval: params.interval,
      pollId: params.pollId,
    }),
    queryFn: async () => {
      const response = await $get({ query: params });
      return response.json();
    },
  });
};

// hook
export const useAnalyticsBrowsers = (
  ...args: Parameters<typeof getUserPollBrowsersOptions>
) => useQuery(getUserPollBrowsersOptions(...args));
