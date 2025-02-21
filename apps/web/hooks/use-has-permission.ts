import { hasUserPermission } from "@pollify/lib";
import type { Plan } from "@pollify/prisma/client";
import { useSession } from "next-auth/react";

export const useHasPermission = () => {
  const { data: session } = useSession();
  const userPlan = session?.user.plan || "FREE";
  return {
    hasPermission: (planName: Plan) => hasUserPermission(planName, userPlan),
  };
};
