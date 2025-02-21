import type { Auth } from "@pollify/types";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { decode } from "next-auth/jwt";

const isSecure = process.env.NODE_ENV === "production";
const cookiePrefix = isSecure ? "__Secure-" : "";

type UserSession =
  | {
      isLoggedIn: false;
      session: undefined;
    }
  | {
      isLoggedIn: true;
      session: Auth.JWTPayload;
    };

export const withAuth = createMiddleware<{
  Variables: {
    user: UserSession;
  };
}>(async (c, next) => {
  const cookieName = `${cookiePrefix}next-auth.session-token`;
  const sessionToken = getCookie(c, cookieName);

  const jwtData =
    (await decode({
      secret: process.env.NEXTAUTH_SECRET!,
      token: sessionToken,
    })) || (undefined as Auth.JWTPayload | undefined);

  c.set("user", {
    isLoggedIn: !!jwtData,
    session: (jwtData as Auth.JWTPayload | undefined) || undefined,
  });
  return next();
});
