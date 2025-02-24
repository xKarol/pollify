import type { Answer, Poll } from "@pollify/prisma/client";
import {
  type MutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { useLocalStorage } from "react-use";

import { pollKeys } from "../queries/poll";
import { client } from "../services/api";

const $submitVote = client.api.polls[":pollId"].vote[":answerId"].$post;

type SubmitVoteResponse = InferResponseType<typeof $submitVote>;
type SubmitVoteRequest = InferRequestType<typeof $submitVote>;
type VotePollOptions = MutationOptions<
  SubmitVoteResponse,
  Error,
  SubmitVoteRequest
>;

export const useVotePoll = (options?: VotePollOptions) => {
  const queryClient = useQueryClient();
  const [userVotes, setUserVotes] = useLocalStorage<string[]>("votes");

  return useMutation<SubmitVoteResponse, Error, SubmitVoteRequest>({
    ...options,
    mutationFn: async (data) => {
      const response = await $submitVote(data);
      return response.json();
    },
    onSuccess(data, variables, ctx) {
      const { pollId, answerId } = data;

      queryClient.invalidateQueries({
        queryKey: pollKeys.getPollUserSelection(pollId),
      });

      queryClient.setQueryData(
        pollKeys.getPoll(pollId),
        (oldPoll: Poll & { answers: Answer[] }) => {
          if (!oldPoll) return;
          return {
            ...oldPoll,
            totalVotes: oldPoll.totalVotes + 1,
            answers: oldPoll.answers.map((answer) => {
              if (answer.id === answerId) {
                return { ...answer, votes: answer.votes + 1 };
              }
              return answer;
            }),
          };
        }
      );

      setUserVotes([...(userVotes || []), `${pollId}:${answerId}`]);

      options?.onSuccess?.(data, variables, ctx);
    },
  });
};
