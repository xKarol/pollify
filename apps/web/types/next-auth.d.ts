import type { Plan } from "@poll/prisma/client";
import type { Auth } from "@poll/types";
import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id?: string;
      plan: Plan;
      timeZone: string;
      clockType: 12 | 24;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends Auth.JWTPayload {}
}
