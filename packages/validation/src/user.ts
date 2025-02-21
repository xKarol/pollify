import type { User } from "@pollify/types";
import { z } from "zod";

export const updateUserSchema: z.ZodSchema<User.UpdateUserData> = z.object({
  name: z.string().nonempty().optional(),
  email: z.string().email().optional(),
  image: z.string().url().optional(),
});
