import { toast } from "@pollify/ui";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";

import { routes } from "../../../config/routes";
import { deleteUser } from "../../../services/api";

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      signOut({ callbackUrl: routes.HOME });
      toast("Your account has been deleted.", { variant: "success" });
    },
  });
};
