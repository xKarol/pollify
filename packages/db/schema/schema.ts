import { relations } from "drizzle-orm";
import {
  pgTable,
  uniqueIndex,
  text,
  timestamp,
  integer,
  foreignKey,
  boolean,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

import { id, timestamps } from "./columns.helpers";

export const plansEnum = pgEnum("plans", ["free", "basic", "pro"]);

export const users = pgTable("user", {
  id,
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: timestamp({ mode: "date" }),
  image: text(),
  plan: plansEnum().notNull().default("free"),
  timeZone: text(),
  clockType: integer().notNull().default(12),
  ...timestamps,
});

export const userRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  polls: many(polls),
  votes: many(votes),
}));

export const accounts = pgTable(
  "account",
  {
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text().$type<AdapterAccount>().notNull(),
    provider: text().notNull(),
    providerAccountId: text().notNull(),
    refresh_token: text(),
    access_token: text(),
    expires_at: integer(),
    token_type: text(),
    scope: text(),
    id_token: text(),
    session_state: text(),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessions = pgTable("session", {
  sessionToken: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp({ mode: "date" }).notNull(),
});

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text().notNull(),
    token: text().notNull(),
    expires: timestamp({ mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialId: text().notNull().unique(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text().notNull(),
    credentialPublicKey: text().notNull(),
    counter: integer().notNull(),
    credentialDeviceType: text().notNull(),
    credentialBackedUp: boolean().notNull(),
    transports: text(),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialId],
      }),
    },
  ]
);

export const polls = pgTable(
  "poll",
  {
    id,
    question: text().notNull(),
    userId: text().references(() => users.id, { onDelete: "cascade" }),
    totalVotes: integer().default(0).notNull(),
    isPublic: boolean().default(true).notNull(),
    requireRecaptcha: boolean().default(false).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("poll_id_key").using(
      "btree",
      table.id.asc().nullsLast().op("text_ops")
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "poll_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const pollRelations = relations(polls, ({ one, many }) => ({
  user: one(users, {
    fields: [polls.userId],
    references: [users.id],
  }),
  answers: many(answers),
  votes: many(votes),
}));

export const answers = pgTable(
  "answer",
  {
    id,
    text: text().notNull(),
    votes: integer().default(0).notNull(),
    pollId: text()
      .notNull()
      .references(() => polls.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("answer_id_key").using(
      "btree",
      table.id.asc().nullsLast().op("text_ops")
    ),
    foreignKey({
      columns: [table.pollId],
      foreignColumns: [polls.id],
      name: "answer_pollId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const answerRelations = relations(answers, ({ one, many }) => ({
  poll: one(polls, {
    fields: [answers.pollId],
    references: [polls.id],
  }),
  votes: many(votes),
}));

export const votes = pgTable(
  "vote",
  {
    id,
    userId: text().references(() => users.id),
    answerId: text()
      .notNull()
      .references(() => answers.id, { onDelete: "cascade" }),
    pollId: text()
      .notNull()
      .references(() => polls.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("vote_id_key").using(
      "btree",
      table.id.asc().nullsLast().op("text_ops")
    ),
    foreignKey({
      columns: [table.answerId],
      foreignColumns: [answers.id],
      name: "vote_answerId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "vote_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
    foreignKey({
      columns: [table.pollId],
      foreignColumns: [polls.id],
      name: "vote_pollId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const voteRelations = relations(votes, ({ one }) => ({
  answer: one(answers, {
    fields: [votes.answerId],
    references: [answers.id],
  }),
  user: one(users, {
    fields: [votes.userId],
    references: [users.id],
  }),
  poll: one(polls, {
    fields: [votes.pollId],
    references: [polls.id],
  }),
}));
