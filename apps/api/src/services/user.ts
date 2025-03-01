import { db } from "@pollify/db/edge";
import { users, polls, votes } from "@pollify/db/schema";
import type { Services as UserServices } from "@pollify/types/user";
import { eq } from "drizzle-orm";

export const updateUserData = async (
  userId: string,
  data: Partial<
    Pick<typeof users.$inferSelect, "name" | "clockType" | "timeZone" | "plan">
  >
) => {
  const [updatedUser] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, userId))
    .returning();
  return updatedUser;
};

export const deleteUser = async (userId: string) => {
  await db.transaction(async (tx) => {
    await tx.delete(users).where(eq(users.id, userId));
    await tx
      .update(votes)
      .set({ userId: "__deleted" })
      .where(eq(votes.userId, userId));
  });
};

export const getUserPolls: UserServices["getUserPolls"] = async ({
  userId,
  page = 1,
  skip,
  limit = 10,
  orderBy = "desc",
  sortBy = "createdAt",
}) => {
  const response = await db.query.polls.findMany({
    offset: skip,
    limit: limit + 1,
    where: eq(polls.userId, userId),
    orderBy: (poll, sort) => [sort[orderBy](poll[sortBy])],
    with: {
      answers: true,
    },
  });

  return {
    data: response.slice(0, limit),
    nextPage: response.length > limit ? page + 1 : undefined,
  };
};

export const getUserVotes: UserServices["getUserVotes"] = async ({
  userId,
  page = 1,
  skip,
  limit = 10,
  orderBy = "desc",
  sortBy = "createdAt",
}) => {
  const response = await db.query.votes.findMany({
    offset: skip,
    limit: limit + 1,
    where: eq(polls.userId, userId),
    orderBy: (poll, sort) => [sort[orderBy](poll[sortBy])],
    with: {
      poll: true,
      answer: true,
    },
  });

  return {
    data: response.slice(0, limit),
    nextPage: response.length > limit ? page + 1 : undefined,
  };
};
