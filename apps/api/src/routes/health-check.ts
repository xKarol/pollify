import { Hono } from "hono";

import type { App } from "..";

const healthCheck: App = new Hono();

healthCheck.get("/health-check", (c) => {
  return c.json({ ok: "ok" });
});

export default healthCheck;
