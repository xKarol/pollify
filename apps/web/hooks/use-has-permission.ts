import type { Plans } from "@pollify/db/types";
import { hasUserPermission } from "@pollify/lib";
import { useSession } from "next-auth/react";

export const useHasPermission = () => {
  const { data: session } = useSession();
  const userPlan = session?.user.plan || "free";
  return {
    hasPermission: (planName: Plans) => hasUserPermission(planName, userPlan),
  };
};
