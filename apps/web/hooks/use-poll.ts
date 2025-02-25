import { queryOptions, useQuery } from "@tanstack/react-query";

import { client } from "../services/api";
import type { HookQueryOptions } from "../types";

const $get = client.api.polls[":pollId"].$get;

export const getPollKey = (pollId: string) => ["poll", pollId] as const;

export const getPollOptions = (
  pollId: string,
  options?: HookQueryOptions<typeof $get>
) => {
  return queryOptions({
    enabled: !!pollId,
    ...options,
    queryKey: getPollKey(pollId),
    queryFn: async () => {
      const response = await $get({ param: { pollId } });
      return response.json();
    },
  });
};

// hook
export const usePoll = (...args: Parameters<typeof getPollOptions>) => {
  return useQuery(getPollOptions(...args));
};
