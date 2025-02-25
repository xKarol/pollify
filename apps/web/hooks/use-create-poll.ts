import { useMutation, useQueryClient } from "@tanstack/react-query";

import { pollKeys } from "../queries/poll";
import { userKeys } from "../queries/user";
import { client } from "../services/api";
import type { HookMutationOptions } from "../types";

const $create = client.api.polls.$post;

export const useCreatePoll = (
  options?: HookMutationOptions<typeof $create>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async (data) => {
      const response = await $create(data);
      return response.json();
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: pollKeys.getPollList() });
      queryClient.invalidateQueries({ queryKey: userKeys.getUserPollList });
      options?.onSuccess?.(...args);
    },
  });
};
