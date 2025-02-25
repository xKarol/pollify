import { queryOptions, useQuery } from "@tanstack/react-query";

import { client } from "../services/api";
import type { HookQueryOptions } from "../types";

const $get = client.api.polls[":pollId"].voters.$get;

export const getPollVotersKey = (pollId: string) =>
  ["poll-voters", pollId] as const;

export const getPollVotersOptions = (
  pollId: string,
  options?: HookQueryOptions<typeof $get>
) => {
  return queryOptions({
    enabled: !!pollId,
    retry: false,
    ...options,
    queryKey: getPollVotersKey(pollId),
    queryFn: async () => {
      const response = await $get({ param: { pollId } });
      return response.json();
    },
  });
};

// hook
export const usePollVoters = (
  ...args: Parameters<typeof getPollVotersOptions>
) => {
  return useQuery(getPollVotersOptions(...args));
};
