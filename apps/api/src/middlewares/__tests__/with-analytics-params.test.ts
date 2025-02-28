import dayjs from "dayjs";
import { Hono } from "hono/quick";
import { testClient } from "hono/testing";
import { expect, test } from "vitest";

import { withAnalyticsParams } from "../with-analytics-params";

const app = new Hono().get("/test", withAnalyticsParams, (c) => {
  const analytics = c.get("analytics");
  return c.json(analytics);
});

const request = () => testClient(app);

test("should return default values", async () => {
  const res = await request().test.$get();
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body.groupBy).toBe("day");
  expect(body.dateFrom).toBe(dayjs().subtract(7, "days").unix());
  expect(body.dateTo).toBe(dayjs().unix());
  expect(body.limit).toBe(50);
});

test.each([
  ["1h", 60, "minute"],
  ["24h", 24, "hour"],
  ["7d", 7, "day"],
  ["30d", 30, "day"],
  ["1y", 12, "month"],
])(
  "interval %s should return valid dateFrom and groupBy field",
  async (interval, value, groupBy) => {
    const res = await request().test.$get({ query: { interval: interval } });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.groupBy).toBe(groupBy);
    expect(body.dateFrom).toBe(
      dayjs()
        .subtract(value, groupBy as dayjs.ManipulateType)
        .unix()
    );
  }
);

test.each([1, 2, 3, 5, 50])(
  "valid 'limit=%s' query param should pass",
  async (value) => {
    const res = await request().test.$get({ query: { limit: value } });
    const body = await res.json();

    expect(body.limit).toBe(value);
  }
);

test.each([-1, 0, -100, "2w", "0sd", "0&test=2"])(
  "invalid 'limit=%s' query param should throw error",
  async (value) => {
    const res = await request().test.$get({ query: { limit: value } });

    expect(res.status).toBe(500);
  }
);

test.each([
  dayjs().subtract(1, "year").unix(),
  dayjs().subtract(8, "month").unix(),
  dayjs().subtract(8, "minute").unix(),
])("custom valid date %s param should pass", async (date) => {
  const res = await request().test.$get({ query: { dateFrom: date } });
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body.dateFrom).toBe(date);
});

test.each([
  dayjs().subtract(1, "year").unix(),
  dayjs().subtract(8, "month").unix(),
  dayjs().subtract(8, "minute").unix(),
])("custom valid date %s param should pass", async (date) => {
  const res = await request().test.$get({ query: { dateTo: date } });
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body.dateTo).toBe(date);
});

test.each([
  // 122121, TODO fix
  0,
  -1,
  "asas",
  "021zz",
])("custom invalid date %s param should throw error", async (date) => {
  let res = await request().test.$get({ query: { dateTo: date } });
  expect(res.status).toBe(500);
  res = await request().test.$get({ query: { dateFrom: date } });
  expect(res.status).toBe(500);
});

test.todo("should throw error when future dateTo param is set", async () => {
  let res = await request().test.$get({
    query: { dateTo: dayjs().add(1, "minute").unix() },
  });
  expect(res.status).toBe(500);

  res = await request().test.$get({
    query: { dateTo: dayjs().add(1, "year").unix() },
  });
  expect(res.status).toBe(500);

  res = await request().test.$get({
    query: { dateTo: dayjs().unix() },
  });
  expect(res.status).toBe(200);
});

test("should throw error when param dateFrom is greater than dateTo", async () => {
  const res = await request().test.$get({
    query: {
      dateFrom: dayjs().add(2, "day").unix(),
      dateTo: dayjs().add(1, "day").unix(),
    },
  });

  expect(res.status).toBe(500);
});

test("should throw error when difference between dates is less than 1 hour", async () => {
  const res = await request().test.$get({
    query: {
      dateFrom: dayjs().subtract(30, "minute").unix(), //30 minutes diff
      dateTo: dayjs().unix(),
    },
  });
  expect(res.status).toBe(500);
});
