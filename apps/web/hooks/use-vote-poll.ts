import type { Answer, Poll } from "@poll/prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useLocalStorage } from "react-use";

import { socket } from "../lib/socket";
import { pollKeys } from "../queries/poll";
import { votePoll } from "../services/api";

export const useVotePoll = () => {
  const queryClient = useQueryClient();
  const [oldValue, setLocalStorageValue] = useLocalStorage("poll-voted", []);
  const { data: session } = useSession();

  return useMutation({
    mutationFn: ({
      pollId,
      answerId,
      reCaptchaToken,
    }: {
      pollId: string;
      answerId: string;
      reCaptchaToken: string;
    }) => {
      return votePoll(pollId, answerId, reCaptchaToken);
    },
    onSuccess(data, variables) {
      const { pollId, answerId } = variables;
      queryClient.setQueryData(
        pollKeys.single(pollId),
        (old: Poll & { answers: Answer[] }) => {
          return {
            ...old,
            totalVotes: old.totalVotes + 1,
            answers: old.answers.map((answer) => {
              if (answer.id === answerId) {
                return { ...answer, votes: answer.votes + 1 };
              }
              return answer;
            }),
          };
        }
      );
      const userId = session ? session.user.id : undefined;
      queryClient.setQueryData(pollKeys.getPollAnswerUserChoice(pollId), {
        id: data.id,
        answerId: answerId,
        userId: userId,
        pollId: pollId,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
      });
      setLocalStorageValue([...oldValue, [pollId, answerId]]);

      socket.connect();
      socket.emit("poll-vote-trigger", { pollId });
    },
  });
};
