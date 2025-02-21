import type { Prisma } from "@pollify/types";

const plans: Prisma.Plan[] = ["FREE", "BASIC", "PRO"];

export function hasUserPermission(
  planName: Prisma.Plan,
  currentPlan: Prisma.Plan
) {
  if (plans.indexOf(currentPlan) >= plans.indexOf(planName)) return true;
  return false;
}
