import type { Answer, Poll } from "@poll/prisma";
import type { WebSocket as WebSocketType } from "@poll/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useLocalStorage } from "react-use";

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
    }: {
      pollId: string;
      answerId: string;
    }) => {
      return votePoll(pollId, answerId);
    },
    onSuccess(data, variables) {
      const { pollId, answerId } = variables;
      queryClient.setQueryData(
        pollKeys.single(pollId),
        (old: Poll & { answers: Answer[] }) => {
          return {
            ...old,
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

      const websocket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL);

      websocket.onopen = () => {
        const data: { e: WebSocketType.Events; data: string } = {
          e: "POLL_VOTES",
          data: pollId,
        };
        websocket.send(JSON.stringify(data));
      };
    },
  });
};
