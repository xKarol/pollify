import { DEFAULT_ANALYTICS_INTERVAL } from "@poll/config";
import dayjs from "dayjs";
import { z } from "zod";

import { parseInterval } from "../utils/parse-interval";

export const pollQueryParams = z.object({
  pollId: z.string().optional(),
});

export type AnalyticsPollQueryParams = z.infer<typeof pollQueryParams>;

export const defaultQueryParams = z
  .object({
    limit: z.coerce.number().positive().optional(),
    dateFrom: z.coerce.number().positive().optional(),
    // TODO fix validating unix timestamp, 122121 - this should fail
    // .refine((date) => !dayjs(date, "X", true).isValid(), {
    //   message: "Invalid dateFrom unix time.",
    // })
    dateTo: z.coerce.number().positive().optional(),
    // TODO fix validating unix timestamp, 122121 - this should fail
    // .refine(
    //   (date) => {
    //     if (date) return true;
    //     if (dayjs(date).unix() <= dayjs().unix()) return true;
    //     // if (!dayjs(date, "X", true).isValid()) return false;
    //     return false;
    //   },
    //   {
    //     message: "Invalid dateTo unix time.",
    //   }
    // ),
    interval: z
      .string()
      .default(DEFAULT_ANALYTICS_INTERVAL)
      .transform(parseInterval),
  })
  .superRefine((val, ctx) => {
    if (val.dateFrom && val.dateTo) {
      if (val.dateFrom > val.dateTo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "DateFrom cannot be greater than DateTo.",
        });
      }
      if (
        Math.abs(dayjs(val.dateFrom * 1000).diff(val.dateTo * 1000, "minute")) <
        60
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Difference between dates should be at least 1 hour.",
        });
      }
    }
  });

export type AnalyticsQueryParams = z.infer<typeof defaultQueryParams>;
