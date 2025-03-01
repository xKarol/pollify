import type { answers, plansEnum, polls, users, votes } from "./schema/schema";

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Poll = typeof polls.$inferSelect;
export type InsertPoll = typeof polls.$inferInsert;

export type Answer = typeof answers.$inferSelect;
export type InsertAnswer = typeof answers.$inferInsert;

export type Vote = typeof votes.$inferSelect;
export type InsertVote = typeof votes.$inferInsert;

export type Plans = (typeof plansEnum.enumValues)[number];
