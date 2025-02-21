import type { Analytics } from "@pollify/types";

export const DEFAULT_ANALYTICS_INTERVAL: Analytics.Interval = "7d" as const;
// @ts-ignore
export const validAnalyticsIntervals: Analytics.Interval[] = [
  "1h",
  "24h",
  "7d",
  "30d",
  "1y",
] as const;

export const MAX_POLL_OPTIONS = 10;
