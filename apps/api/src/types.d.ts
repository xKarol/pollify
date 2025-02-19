import type { MiddlewareHandler } from "hono";

export type MiddlewareEnv<T extends MiddlewareHandler> =
  T extends MiddlewareHandler<infer U> ? U : never;
