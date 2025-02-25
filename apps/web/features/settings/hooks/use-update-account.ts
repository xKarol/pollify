import { useMutation } from "@tanstack/react-query";

import { client } from "../../../services/api";
import type { HookMutationOptions } from "../../../types";

const $update = client.api.me.$patch;

export const useUpdateAccount = (
  options?: HookMutationOptions<typeof $update>
) => {
  return useMutation({
    ...options,
    mutationFn: async (data) => {
      const response = await $update(data);
      return response.json();
    },
  });
};
