import type { Plan } from "@pollify/prisma/client";

export type JWTPayload = {
  id: string;
  name: string;
  email: string;
  image: string;
  plan: Plan;
  timeZone: string;
  clockType: number;
};
