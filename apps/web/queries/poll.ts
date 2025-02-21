import type { SortingParams, Poll } from "@pollify/types";
import type {
  UseInfiniteQueryOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

import {
  getPoll,
  getPollUserAnswerChoice,
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
  single: (pollId: string) => ["poll", pollId] as const,
  getPollVoters: (pollId: string) => ["poll-voters", pollId] as const,
  getPollAnswerUserChoice: (pollId: string) =>
    ["poll-answer-user-choice", pollId] as const,
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
  single: (
    pollId: string,
    options?: UseQueryOptions<Awaited<ReturnType<typeof getPoll>>>
  ): UseQueryOptions<Awaited<ReturnType<typeof getPoll>>> => ({
    enabled: !!pollId,
    ...options,
    queryKey: pollKeys.single(pollId),
    queryFn: () => getPoll(pollId),
  }),
  getPollVoters: (
    pollId: string,
    options?: UseQueryOptions<Awaited<ReturnType<typeof getPollVoters>>>
  ): UseQueryOptions<Awaited<ReturnType<typeof getPollVoters>>> => ({
    enabled: !!pollId,
    ...options,
    queryKey: pollKeys.getPollVoters(pollId),
    queryFn: () => getPollVoters(pollId),
  }),
  getPollAnswerUserChoice: (
    pollId: string,
    options?: UseQueryOptions<
      Awaited<ReturnType<typeof getPollUserAnswerChoice>>
    >
  ): UseQueryOptions<Awaited<ReturnType<typeof getPollUserAnswerChoice>>> => ({
    enabled: !!pollId,
    ...options,
    queryKey: pollKeys.getPollAnswerUserChoice(pollId),
    queryFn: () => getPollUserAnswerChoice(pollId),
  }),
} satisfies Record<keyof typeof pollKeys, unknown>;
