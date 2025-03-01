import { faker } from "@faker-js/faker";
import { eq, sql } from "drizzle-orm";
import { reset } from "drizzle-seed";
import he from "he";
import shuffle from "lodash.shuffle";
import type { Ora } from "ora";
import ora from "ora";

import { db } from "./edge";
import * as schema from "./schema";
import {
  users,
  polls as pollsTable,
  answers,
  votes,
  polls,
} from "./schema/schema";
import type {
  Answer,
  InsertAnswer,
  InsertPoll,
  InsertUser,
  Poll,
  User,
} from "./types";

export type Context = {
  db: typeof db;
  spinner: Ora;
  polls: (Poll & { answers: Answer[] })[];
  users: User[];
};

export function getContext(): Context {
  return {
    db,
    spinner: ora(),
    users: [],
    polls: [],
  };
}

function getTimestamps() {
  const createdAt = faker.date.past();
  return {
    createdAt: createdAt,
    updatedAt: faker.datatype.boolean()
      ? createdAt
      : faker.date.between({ from: createdAt, to: Date.now() }),
  };
}

export async function getPollsData(
  limit: number = 25
): Promise<ReturnType<typeof generateFakePollData>[]> {
  try {
    const res = await fetch(
      `https://opentdb.com/api.php?amount=${limit}&category=9&difficulty=medium&type=multiple`
    );
    const data = await res.json();
    const results = data.results;
    return Array.from({ length: results.length }, generateFakePollData).map(
      (poll, index) => {
        const result = results[index];
        const answers = shuffle([
          result.correct_answer,
          ...result.incorrect_answers,
        ]);

        return {
          ...poll,
          question: he.decode(result.question),
          answers: poll.answers.map((answer, index) => ({
            ...answer,
            text: he.decode(answers[index]),
          })),
        };
      }
    );
  } catch {
    console.log("WARN: API doesn't response. Using fake data...");
    return Array.from({ length: limit }, generateFakePollData);
  }
}

export function generateFakePollData(isPublic: boolean = true) {
  const data: Omit<InsertPoll, "userId" | "id"> & {
    answers: Omit<InsertAnswer, "id" | "pollId">[];
  } = {
    question: faker.lorem.sentence(),
    answers: Array.from({ length: 4 }, generateFakePollAnswerData),
    isPublic: isPublic,
    requireRecaptcha: faker.datatype.boolean(),
    ...getTimestamps(),
  };
  return data;
}

export function generateFakePollAnswerData() {
  const data: Omit<InsertAnswer, "id" | "pollId"> = {
    text: faker.datatype.boolean()
      ? faker.lorem.word()
      : faker.lorem.sentence(),
    votes: 0,
    ...getTimestamps(),
  };
  return data;
}

export function generateFakeUserData() {
  const data: Omit<InsertUser, "id"> = {
    email: faker.internet.email(),
    name: faker.internet.displayName(),
    emailVerified: faker.date.past(),
    image: faker.image.avatar(),
    plan: faker.helpers.arrayElement(["free", "basic", "pro"]),
    timeZone: faker.location.timeZone(),
    clockType: 12,
    ...getTimestamps(),
  };
  return data;
}

export const seedUsers = async (ctx: Context) => {
  const totalUsers = faker.number.int({ min: 100, max: 500 });

  const data = Array.from({ length: totalUsers }, generateFakeUserData);

  const result = await db.insert(users).values(data).execute();

  const allUsers = await ctx.db.query.users.findMany({});
  ctx.users = allUsers;

  ctx.spinner.text = `Created ${result.rowCount} users`;
};

export const seedPolls = async (ctx: Context) => {
  if (ctx.users.length === 0) {
    ctx.spinner.fail("No users found. Please seed users first.");
    return;
  }

  const totalPolls = faker.number.int({ min: 100, max: 150 });
  const data = await getPollsData(totalPolls);

  const pollsData = data.map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ answers, ...pollFields }): InsertPoll => ({
      ...pollFields,
      userId: faker.datatype.boolean()
        ? ctx.users[Math.floor(Math.random() * ctx.users.length)].id
        : null,
    })
  );

  await ctx.db.transaction(async (tx) => {
    const insertedPolls = await tx
      .insert(pollsTable)
      .values(pollsData)
      .returning({ id: pollsTable.id });

    const answersData = data.flatMap((pollData, index) =>
      pollData.answers.map((answer) => ({
        pollId: insertedPolls[index].id,
        ...answer,
      }))
    );

    await tx.insert(answers).values(answersData);
  });

  const polls = await ctx.db.query.polls.findMany({
    with: {
      answers: true,
    },
  });

  ctx.polls = polls;
  ctx.spinner.text = `Created ${polls.length} polls`;
};
export const seedVotes = async (ctx: Context) => {
  if (ctx.users.length === 0) {
    ctx.spinner.fail("No users found. Please seed users first.");
    return;
  }
  if (ctx.polls.length === 0) {
    ctx.spinner.fail("No polls found. Please seed polls first.");
    return;
  }

  await ctx.db.transaction(async (tx) => {
    const voteData: (typeof votes.$inferInsert)[] = [];
    const pollUpdates: { id: string; votes: number }[] = [];
    const answerUpdates: { id: string; votes: number }[] = [];

    for (const poll of ctx.polls) {
      const totalVotes = faker.number.int({ min: 0, max: 200 });

      const votes = Array.from({ length: totalVotes }, () => {
        const randomAnswer =
          poll.answers[Math.floor(Math.random() * poll.answers.length)];
        return {
          pollId: poll.id,
          answerId: randomAnswer.id,
          userId: ctx.users[Math.floor(Math.random() * ctx.users.length)].id,
        };
      });

      const answerVoteCounts: Record<string, number> = {};
      for (const vote of votes) {
        answerVoteCounts[vote.answerId] =
          (answerVoteCounts[vote.answerId] || 0) + 1;
      }

      voteData.push(...votes);
      pollUpdates.push({ id: poll.id, votes: totalVotes });

      for (const [answerId, count] of Object.entries(answerVoteCounts)) {
        answerUpdates.push({ id: answerId, votes: count });
      }
    }

    if (voteData.length > 0) {
      await tx.insert(votes).values(voteData);
    }

    for (const update of pollUpdates) {
      await tx
        .update(polls)
        .set({ totalVotes: sql`${polls.totalVotes} + ${update.votes}` })
        .where(eq(polls.id, update.id));
    }

    for (const update of answerUpdates) {
      await tx
        .update(answers)
        .set({ votes: sql`${answers.votes} + ${update.votes}` })
        .where(eq(answers.id, update.id));
    }
  });

  const totalVotes = await ctx.db
    .select({ count: sql<number>`count(*)` })
    .from(votes);

  ctx.spinner.text = `Created ${totalVotes[0].count} votes`;
};
export const clearDatabase = async (ctx: Context) => {
  await reset(db, schema);
  ctx.spinner.text = `Database has been cleared.`;
};
