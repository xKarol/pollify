import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

import { routes } from "../../../config/routes";
import { client } from "../../../services/api";
import type { HookMutationOptions } from "../../../types";

const $delete = client.api.me.$delete;

export const useDeleteAccount = (
  options?: HookMutationOptions<typeof $delete>
) => {
  return useMutation({
    ...options,
    mutationFn: async (data) => {
      const response = await $delete(data);
      return response.json();
    },
    onSuccess: async (...args) => {
      signOut({ callbackUrl: routes.HOME });
      toast.success("Your account has been deleted.");
      options?.onSuccess?.(...args);
    },
  });
};
