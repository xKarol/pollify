import { queryOptions, useQuery } from "@tanstack/react-query";

import { client } from "../services/api";
import type { HookQueryOptions } from "../types";

const $get = client.api.polls[":pollId"]["user-selection"].$get;

export const getPollUserSelectionKey = (pollId: string) =>
  ["poll-user-selection", pollId] as const;

export const getPollUserSelectionOptions = (
  pollId: string,
  options?: HookQueryOptions<typeof $get>
) => {
  return queryOptions({
    enabled: !!pollId,
    ...options,
    queryKey: getPollUserSelectionKey(pollId),
    queryFn: async () => {
      const response = await $get({ param: { pollId } });
      return response.json();
    },
  });
};

// hook
export const usePollUserSelection = (pollId: string): string | undefined => {
  const { data } = useQuery(getPollUserSelectionOptions(pollId));

  return data?.answer?.id ?? getStoredVote(pollId);
};

function getStoredVote(pollId: string): string | undefined {
  const voteItems = localStorage.getItem("votes");
  if (!voteItems) return undefined;

  const votes = JSON.parse(voteItems) as string[];
  const vote = votes.map((v) => v.split(":")).find(([id]) => id === pollId);

  return vote ? vote[1] : undefined;
}
