import type { Analytics } from "@pollify/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { client } from "../../../services/api";
import type { HookQueryOptions } from "../../../types";

const $get = client.api.polls.analytics.votes.$get;

export const getAnalyticsVotesKey = ({
  interval,
  pollId,
}: Analytics.ClientAnalyticsParams) =>
  ["analytics.votes", { interval, pollId }] as const;

export const getAnalyticsVotesOptions = (
  params: Analytics.ClientAnalyticsParams,
  options?: HookQueryOptions<typeof $get>
) => {
  return queryOptions({
    ...options,
    queryKey: getAnalyticsVotesKey({
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
export const useAnalyticsVotes = (
  ...args: Parameters<typeof getAnalyticsVotesOptions>
) => useQuery(getAnalyticsVotesOptions(...args));
