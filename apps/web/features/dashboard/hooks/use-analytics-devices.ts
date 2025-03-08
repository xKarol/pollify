import type { Analytics } from "@pollify/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { client } from "../../../services/api";
import type { HookQueryOptions } from "../../../types";

const $get = client.api.polls.analytics.devices.$get;

export const getAnalyticsDevicesKey = ({
  interval,
  pollId,
}: Analytics.ClientAnalyticsParams) =>
  ["analytics.devices", { interval, pollId }] as const;

export const getAnalyticsDevicesOptions = (
  params: Analytics.ClientAnalyticsParams,
  options?: HookQueryOptions<typeof $get>
) => {
  return queryOptions({
    ...options,
    queryKey: getAnalyticsDevicesKey({
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
export const useAnalyticsDevices = (
  ...args: Parameters<typeof getAnalyticsDevicesOptions>
) => useQuery(getAnalyticsDevicesOptions(...args));
