import type { Plans } from "@pollify/db/types";

export type JWTPayload = {
  id: string;
  name: string;
  email: string;
  image: string;
  plan: Plans;
  timeZone: string;
  clockType: number;
};
