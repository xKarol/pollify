import { useQuery } from "@tanstack/react-query";

import { pollOptions } from "../queries/poll";

export const usePollUserSelection = (pollId: string): string | undefined => {
  const { data } = useQuery(pollOptions.getPollUserSelection(pollId));

  return data?.answer?.id ?? getStoredVote(pollId);
};

function getStoredVote(pollId: string): string | undefined {
  const voteItems = localStorage.getItem("votes");
  if (!voteItems) return undefined;

  const votes = JSON.parse(voteItems) as string[];
  const vote = votes.map((v) => v.split(":")).find(([id]) => id === pollId);

  return vote ? vote[1] : undefined;
}
