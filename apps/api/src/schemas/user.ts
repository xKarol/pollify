import { UserValidator } from "@pollify/validations";
import type { User } from "@pollifyify/types";
import { z } from "zod";

export const updateUser: z.Schema<{ body: User.UpdateUserData }> = z.object({
  body: UserValidator.updateUserSchema,
});
export type UpdateUserData = z.infer<typeof updateUser>;
