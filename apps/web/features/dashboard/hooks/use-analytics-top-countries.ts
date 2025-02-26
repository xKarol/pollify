import type { Analytics } from "@pollify/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { client } from "../../../services/api";
import type { HookQueryOptions } from "../../../types";

const $get = client.api.polls.analytics["top-countries"].$get;

export const getUserPollTopCountriesKey = ({
  interval,
  pollId,
}: Analytics.ClientAnalyticsParams) =>
  ["analytics.top-countries", { interval, pollId }] as const;

export const getUserPollTopCountriesOptions = (
  params: Analytics.ClientAnalyticsParams,
  options?: HookQueryOptions<typeof $get>
) => {
  return queryOptions({
    ...options,
    queryKey: getUserPollTopCountriesKey({
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
export const useAnalyticsTopCountries = (
  ...args: Parameters<typeof getUserPollTopCountriesOptions>
) => useQuery(getUserPollTopCountriesOptions(...args));
