import type { User } from "@pollify/types";
import { z } from "zod";

export const updateUserSchema: z.ZodSchema<User.UpdateUserData> = z.object({
  name: z.string().nonempty().optional(),
  email: z.string().email().optional(),
  timeZone: z.string().optional(),
  clockType: z.coerce
    .number()
    .int()
    .refine((val) => val === 12 || val === 24, {
      message: "Clock type must be 12 or 24",
    }),
});
