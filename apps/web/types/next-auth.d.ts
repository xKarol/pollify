import type { Auth } from "@pollify/types";
import type { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    timeZone?: string;
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: Auth.JWTPayload;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends Auth.JWTPayload {}
}
