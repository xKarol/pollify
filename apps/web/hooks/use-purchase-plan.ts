import { useMutation } from "@tanstack/react-query";

import { client } from "../services/api";
import type { HookMutationOptions } from "../types";

const $purchase = client.api.payments["checkout-sessions"].$post;

export const usePurchasePlan = (
  options?: HookMutationOptions<typeof $purchase>
) => {
  return useMutation({
    ...options,
    mutationFn: async (data) => {
      const response = await $purchase(data);
      return response.json();
    },
  });
};
