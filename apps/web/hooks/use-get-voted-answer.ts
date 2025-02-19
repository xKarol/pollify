import type { Answer } from "@poll/prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom, atom } from "jotai";
import { useEffect, useCallback } from "react";

import { pollKeys } from "../queries/poll";

const votedAnswerAtom = atom<string | undefined>("");

export const useGetVotedAnswer = (pollId: string, answers: Answer[]) => {
  const [votedAnswer, setVotedAnswer] = useAtom(votedAnswerAtom);
  const queryClient = useQueryClient();

  const getVotedVote = useCallback(() => {
    const votedPolls: [string, string][] = JSON.parse(
      localStorage.getItem("poll-voted")
    );

    if (Array.isArray(votedPolls)) {
      const findVote = votedPolls.find(
        ([votedPoll, answerId]) =>
          votedPoll === pollId &&
          answers.findIndex(({ id }) => id === answerId) !== -1
      );
      if (findVote) {
        const [, answerId] = findVote;
        return answerId;
      }
    }
    return undefined;
  }, [pollId, answers]);

  useEffect(() => {
    const queryCache = queryClient.getQueryCache();
    const unsubscribe = queryCache.subscribe((queryCacheNotifyEvent) => {
      if (!queryCacheNotifyEvent) return;

      if (
        JSON.stringify(queryCacheNotifyEvent.query.queryKey) ===
        JSON.stringify(pollKeys.single(pollId))
      ) {
        setVotedAnswer(getVotedVote());
      }
    });
    return () => unsubscribe();
  }, [pollId, queryClient, getVotedVote, setVotedAnswer]);

  return votedAnswer === "" ? undefined : (votedAnswer as string | undefined);
};
