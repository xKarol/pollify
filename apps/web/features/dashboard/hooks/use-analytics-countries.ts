import type { Analytics } from "@pollify/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { client } from "../../../services/api";
import type { HookQueryOptions } from "../../../types";

const $get = client.api.polls.analytics.countries.$get;

export const getUserPollCountriesKey = ({
  interval,
  pollId,
}: Analytics.ClientAnalyticsParams) =>
  ["analytics.countries", { interval, pollId }] as const;

export const getUserPollCountriesOptions = (
  params: Analytics.ClientAnalyticsParams,
  options?: HookQueryOptions<typeof $get>
) => {
  return queryOptions({
    ...options,
    queryKey: getUserPollCountriesKey({
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
export const useAnalyticsCountries = (
  ...args: Parameters<typeof getUserPollCountriesOptions>
) => useQuery(getUserPollCountriesOptions(...args));
