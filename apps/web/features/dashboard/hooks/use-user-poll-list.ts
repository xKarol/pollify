import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

import { client } from "../../../services/api";
import type { HookInfiniteQueryOptions } from "../../../types";

const $get = client.api.me.poll.$get;

export const getUserPollListKey = ["user.polls"] as const;

export const getUserPollListOptions = (
  options?: HookInfiniteQueryOptions<typeof $get>
) => {
  return infiniteQueryOptions({
    ...options,
    queryKey: getUserPollListKey,
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
export const useUserPollList = (
  ...args: Parameters<typeof getUserPollListOptions>
) => {
  return useInfiniteQuery(getUserPollListOptions(...args));
};
