import { createMiddleware } from "hono/factory";
import httpError from "http-errors";

import type { MiddlewareEnv } from "../types";
import type { withAuth } from "./with-auth";

type AuthMiddlewareUserData = MiddlewareEnv<
  typeof withAuth
>["Variables"]["user"];

export const requireAuth = createMiddleware<{
  Variables: {
    user: AuthMiddlewareUserData & {
      isLoggedIn: true;
      session: NonNullable<AuthMiddlewareUserData["session"]>;
    };
  };
}>(async (c, next) => {
  const session = c.get("user");
  if (!session) {
    // TODO when no session it means with-auth middleware is not called before this middleware - log message only in dev
    throw httpError.Unauthorized("Please Log In.");
  }
  if (!session.isLoggedIn) {
    throw httpError.Unauthorized("Please Log In.");
  }
  return next();
});
