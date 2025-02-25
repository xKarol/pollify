import { useMutation } from "@tanstack/react-query";

import { client } from "../services/api";
import type { HookMutationOptions } from "../types";

const $delete = client.api.polls[":pollId"].$delete;

export const useDeletePoll = (
  options?: HookMutationOptions<typeof $delete>
) => {
  return useMutation({
    ...options,
    mutationFn: async (data) => {
      const response = await $delete(data);
      return response.json();
    },
    // TODO update query cache on success
  });
};
