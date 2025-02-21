import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { createPlanCheckoutSession } from "../services/api";

export const usePurchasePlan = (options: UseMutationOptions) => {
  return useMutation({
    ...options,
    mutationFn: ({ priceId }: { priceId: string }) => {
      return createPlanCheckoutSession(priceId);
    },
  });
};
