import { Hono } from "hono";

const healthCheck = new Hono();

healthCheck.get("/health-check", (c) => {
  return c.json({ ok: true });
});

export default healthCheck;
