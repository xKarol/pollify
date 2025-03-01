import { db } from "@pollify/db/edge";
import { answers, polls, users, votes } from "@pollify/db/schema";
import type { Poll } from "@pollify/db/types";
import type { PaginationParams, SortingParams } from "@pollify/types";
import { CreatePollData, SortPollFields } from "@pollify/types/poll";
import { asc, desc, eq, sql } from "drizzle-orm";

export const getPollList = async ({
  page = 1,
  skip,
  limit = 10,
  orderBy = "desc",
  sortBy = "createdAt",
}: PaginationParams & {
  skip: number;
} & SortingParams<SortPollFields>) => {
  const query = db
    .select({
      id: polls.id,
      question: polls.question,
      userId: polls.userId,
      totalVotes: polls.totalVotes,
      isPublic: polls.isPublic,
      requireRecaptcha: polls.requireRecaptcha,
      createdAt: polls.createdAt,
      updatedAt: polls.updatedAt,
      user: {
        id: users.id,
        name: users.name,
        image: users.image,
      },
    })
    .from(polls)
    .where(eq(polls.isPublic, true))
    .leftJoin(users, eq(polls.userId, users.id))
    .orderBy(orderBy === "asc" ? asc(polls[sortBy]) : desc(polls[sortBy]))
    .offset(skip)
    .limit(limit + 1);

  const response = await query;

  return {
    data: response.slice(0, limit),
    nextPage: response.length > limit ? page + 1 : undefined,
  };
};

export const getPoll = async (pollId: string) => {
  const response = await db.query.polls.findFirst({
    where: (field, { eq }) => eq(field.id, pollId),
    with: {
      answers: true,
      user: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
  return response;
};

export const getPollVotes = async (pollId: string) => {
  return db.select().from(answers).where(eq(answers.pollId, pollId));
};

export const createPoll = async (data: CreatePollData) => {
  return db.transaction(async (tx) => {
    const [newPoll] = await tx
      .insert(polls)
      .values({
        userId: data.userId,
        question: data.question,
        isPublic: data.isPublic,
        requireRecaptcha: data.requireRecaptcha,
      })
      .returning();

    await tx
      .insert(answers)
      .values(data.answers.map((a) => ({ ...a, pollId: newPoll.id })));

    return newPoll;
  });
};

export const updatePoll = async (pollId: string, data: Poll) => {
  const [updated] = await db
    .update(polls)
    .set(data)
    .where(eq(polls.id, pollId))
    .returning();

  return updated;
};

export const deletePoll = async (pollId: string) => {
  await db.delete(polls).where(eq(polls.id, pollId));
};

export const votePoll = async ({
  userId,
  pollId,
  answerId,
}: {
  userId?: string;
  pollId: string;
  answerId: string;
}) => {
  return db.transaction(async (tx) => {
    await tx
      .update(polls)
      .set({ totalVotes: sql`${polls.totalVotes} + 1` })
      .where(eq(polls.id, pollId));

    await tx
      .update(answers)
      .set({ votes: sql`${answers.votes} + 1` })
      .where(eq(answers.id, answerId));

    const [newVote] = await tx
      .insert(votes)
      .values({ userId, pollId, answerId })
      .returning();

    return newVote;
  });
};

export const getPollVoters = async (pollId: string) => {
  const results = await db
    .selectDistinctOn([votes.userId], {
      user: {
        id: users.id,
        name: users.name,
        image: users.image,
      },
    })
    .from(votes)
    .where(eq(votes.pollId, pollId))
    .leftJoin(users, eq(votes.userId, users.id))
    .limit(10);

  return results.filter((r) => r.user !== null).map((r) => r.user!);
};

export const getPollAnswer = async (answerId: string) => {
  const [result] = await db
    .select()
    .from(answers)
    .where(eq(answers.id, answerId));

  return result;
};

export const getPollVote = async (voteId: string) => {
  const [result] = await db.select().from(votes).where(eq(votes.id, voteId));

  return result;
};

export const getPollUserSelection = async (userId: string, pollId: string) => {
  const response = await db.query.votes.findFirst({
    where: (field, { eq, and }) =>
      and(eq(field.userId, userId), eq(field.pollId, pollId)),
    with: {
      answer: true,
    },
  });

  return response?.answer;
};
