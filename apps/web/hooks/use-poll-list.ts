import type { Poll, SortingParams } from "@pollify/types";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

import { client } from "../services/api";
import type { HookInfiniteQueryOptions } from "../types";

const $get = client.api.polls.$get;

export const getPollListKey = (
  { sortBy, orderBy }: SortingParams<Poll.SortPollFields> = {
    sortBy: "createdAt",
    orderBy: "desc",
  }
) => {
  return ["poll.list", { sortBy, orderBy }] as const;
};

export const getPollListOptions = (
  sortParams?: SortingParams<Poll.SortPollFields>,
  options?: HookInfiniteQueryOptions<typeof $get>
) => {
  return infiniteQueryOptions({
    ...options,
    queryKey: getPollListKey(sortParams),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await $get({
        query: {
          page: pageParam,
          limit: 10,
          ...sortParams,
        },
      });
      return response.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};

// hook
export const usePollList = (...args: Parameters<typeof getPollListOptions>) => {
  return useInfiniteQuery(getPollListOptions(...args));
};
