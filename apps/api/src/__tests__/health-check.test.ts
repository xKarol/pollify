import { expect, test } from "vitest";

import app from "..";

test("should return status 200", async () => {
  const res = await app.request("/api/health-check");
  expect(res.status).toBe(200);
});
