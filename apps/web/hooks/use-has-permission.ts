import { hasUserPermission } from "@poll/lib";
import type { Plan } from "@poll/prisma/client";
import { useSession } from "next-auth/react";

export const useHasPermission = () => {
  const { data: session } = useSession();
  const userPlan = session?.user.plan || "FREE";
  return {
    hasPermission: (planName: Plan) => hasUserPermission(planName, userPlan),
  };
};
