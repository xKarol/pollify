import type { SortingParams, Poll } from "@pollify/types";
import type {
  UseInfiniteQueryOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import {
  client,
  getPoll,
  getPollUserSelection,
  getPollVoters,
  getPolls,
} from "../services/api";

export const pollKeys = {
  all: (
    { sortBy, orderBy }: SortingParams<Poll.SortPollFields> = {
      sortBy: "createdAt",
      orderBy: "desc",
    }
  ) => {
    return ["poll", { sortBy, orderBy }] as const;
  },
  getPoll: (pollId: string) => ["poll", pollId] as const,
  getPollVoters: (pollId: string) => ["poll-voters", pollId] as const,
  getPollUserSelection: (pollId: string) =>
    ["poll-user-selection", pollId] as const,
};

export const pollOptions = {
  all: (
    sortParams?: SortingParams<Poll.SortPollFields>,
    options?: UseInfiniteQueryOptions<Awaited<ReturnType<typeof getPolls>>>
  ): UseInfiniteQueryOptions<Awaited<ReturnType<typeof getPolls>>> => ({
    ...options,
    queryKey: pollKeys.all(sortParams),
    queryFn: ({ pageParam = 1 }) => {
      return getPolls({ page: pageParam, limit: 10, ...sortParams });
    },
    getNextPageParam: ({ nextPage }) => nextPage,
  }),
  getPoll: (
    pollId: string,
    options?: UseQueryOptions<Awaited<ReturnType<typeof getPoll>>>
  ): UseQueryOptions<Awaited<ReturnType<typeof getPoll>>> => ({
    enabled: !!pollId,
    retry: false,
    ...options,
    queryKey: pollKeys.getPoll(pollId),
    queryFn: () => getPoll(pollId),
  }),
  getPollVoters: (
    pollId: string,
    options?: UseQueryOptions<Awaited<ReturnType<typeof getPollVoters>>>
  ): UseQueryOptions<Awaited<ReturnType<typeof getPollVoters>>> => ({
    enabled: !!pollId,
    retry: false,
    ...options,
    queryKey: pollKeys.getPollVoters(pollId),
    queryFn: () => getPollVoters(pollId),
  }),
  getPollUserSelection: (
    pollId: string,
    options?: UseQueryOptions<
      InferRequestType<
        (typeof client.api.polls)[":pollId"]["user-selection"]["$get"]
      >,
      Error,
      InferResponseType<
        (typeof client.api.polls)[":pollId"]["user-selection"]["$get"]
      >
    >
  ): UseQueryOptions<
    InferRequestType<
      (typeof client.api.polls)[":pollId"]["user-selection"]["$get"]
    >,
    Error,
    InferResponseType<
      (typeof client.api.polls)[":pollId"]["user-selection"]["$get"]
    >
  > => ({
    enabled: !!pollId,
    ...options,
    queryKey: pollKeys.getPollUserSelection(pollId),
    queryFn: async () => {
      const response = await client.api.polls[":pollId"]["user-selection"].$get(
        { param: { pollId } }
      );
      return response.json();
    },
  }),
} satisfies Record<keyof typeof pollKeys, unknown>;
