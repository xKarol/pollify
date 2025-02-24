import { useQuery } from "@tanstack/react-query";

import { pollOptions } from "../queries/poll";

export const usePoll = (...args: Parameters<typeof pollOptions.getPoll>) => {
  return useQuery(pollOptions.getPoll(...args));
};
