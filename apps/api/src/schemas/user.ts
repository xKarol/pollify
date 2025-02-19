import type { User } from "@poll/types";
import { UserValidator } from "@poll/validators";
import { z } from "zod";

export const updateUser: z.Schema<{ body: User.UpdateUserData }> = z.object({
  body: UserValidator.updateUserSchema,
});
export type UpdateUserData = z.infer<typeof updateUser>;
