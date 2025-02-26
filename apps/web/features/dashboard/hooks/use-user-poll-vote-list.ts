import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

import { client } from "../../../services/api";
import type { HookInfiniteQueryOptions } from "../../../types";

const $get = client.api.me.votes.$get;

export const getUserPollVoteListKey = ["user.votes"] as const;

export const getUserPollVoteListOptions = (
  options?: HookInfiniteQueryOptions<typeof $get>
) => {
  return infiniteQueryOptions({
    ...options,
    queryKey: getUserPollVoteListKey,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await $get({
        query: {
          page: pageParam,
          limit: 10,
          // ...sortParams,
        },
      });
      return response.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};

// hook
export const useUserPollVoteList = (
  ...args: Parameters<typeof getUserPollVoteListOptions>
) => {
  return useInfiniteQuery(getUserPollVoteListOptions(...args));
};
