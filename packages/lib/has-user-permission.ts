import type { Plans } from "@pollify/db/types";

const plans: Plans[] = ["free", "basic", "pro"];

export function hasUserPermission(planName: Plans, currentPlan: Plans) {
  if (plans.indexOf(currentPlan) >= plans.indexOf(planName)) return true;
  return false;
}
