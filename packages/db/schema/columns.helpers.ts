import { createId } from "@paralleldrive/cuid2";
import { varchar, timestamp } from "drizzle-orm/pg-core";

export const id = varchar({ length: 128 })
  .$defaultFn(() => createId())
  .primaryKey();

export const timestamps = {
  updatedAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
  deletedAt: timestamp(),
};
