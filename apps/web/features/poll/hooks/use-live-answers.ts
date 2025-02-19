import type { Poll, Answer } from "@poll/prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { socket } from "../../../lib/socket";
import { pollKeys } from "../../../queries/poll";

export const useLiveAnswers = (pollId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.connect();
    socket.on("poll-vote-update", (updatedData) => {
      queryClient.setQueryData(
        pollKeys.single(pollId),
        (old: Poll & { answers: Answer[] }) => {
          return {
            ...old,
            totalVotes:
              updatedData
                .map((answer) => answer.votes)
                .reduce((prev, next) => prev + next) || old.totalVotes,
            answers: updatedData,
          };
        }
      );
    });
    return () => {
      socket.close();
      socket.off("poll-vote-update");
    };
  }, [pollId, queryClient]);

  useEffect(() => {
    if (pollId) {
      socket.emit("join-poll", pollId);
    }
  }, [pollId]);
};
