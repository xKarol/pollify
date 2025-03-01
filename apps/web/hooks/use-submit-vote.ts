import type { Answer, Poll } from "@pollify/db/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "react-use";

import { pollKeys } from "../queries/poll";
import { client } from "../services/api";
import type { HookMutationOptions } from "../types";

const $post = client.api.polls[":pollId"].vote[":answerId"].$post;

export const useSubmitVote = (options?: HookMutationOptions<typeof $post>) => {
  const queryClient = useQueryClient();
  const [userVotes, setUserVotes] = useLocalStorage<string[]>("votes");

  return useMutation({
    ...options,
    mutationFn: async (data) => {
      const response = await $post(data);
      return response.json();
    },
    onSuccess: (...args) => {
      const [{ pollId, answerId }] = args;

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

      options?.onSuccess?.(...args);
    },
  });
};
