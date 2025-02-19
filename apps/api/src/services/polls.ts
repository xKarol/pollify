import { prisma } from "@poll/prisma/edge";
import type { Poll } from "@poll/types";

// @ts-expect-error TODO fix
export const getPolls: Poll.Services["getPolls"] = async ({
  page = 1,
  skip,
  limit = 10,
  orderBy = "desc",
  sortBy = "createdAt",
}) => {
  const response = await prisma.poll.findMany({
    skip: skip,
    take: limit + 1,
    where: {
      isPublic: true,
    },
    orderBy: {
      [sortBy]: orderBy,
    },
    include: { user: true },
  });

  return {
    data: response.slice(0, limit),
    nextPage: response.length > limit ? page + 1 : undefined,
  };
};

export const getPoll = async (pollId: string) => {
  const response = await prisma.poll.findUniqueOrThrow({
    where: {
      id: pollId,
    },
    include: { answers: true, user: true },
  });
  return response;
};

export const getPollVotes = async (pollId: string) => {
  const response = await prisma.answer.findMany({
    where: {
      pollId: pollId,
    },
  });
  return response;
};
export const createPoll = async (data: Poll.CreatePollData) => {
  const response = await prisma.poll.create({
    data: {
      userId: data.userId,
      question: data.question,
      isPublic: data.isPublic,
      requireRecaptcha: data.requireRecaptcha,
      answers: {
        createMany: { data: data.answers },
      },
    },
  });
  return response;
};

export const updatePoll: Poll.Services["updatePoll"] = async (pollId, data) => {
  const response = await prisma.poll.update({
    where: { id: pollId },
    data: {
      ...data,
    },
  });
  return response;
};

export const deletePoll = async (pollId: string) => {
  await prisma.poll.delete({
    where: { id: pollId },
  });
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
  await prisma.poll.update({
    where: { id: pollId },
    data: {
      totalVotes: {
        increment: 1,
      },
      answers: {
        update: {
          where: {
            id: answerId,
          },
          data: { votes: { increment: 1 } },
        },
      },
    },
  });
  const response = await prisma.vote.create({
    data: {
      userId: userId,
      pollId,
      answerId,
    },
  });
  return response;
};

export const getPollVoters = async (pollId: string) => {
  const users = await prisma.vote.findMany({
    take: 10,
    where: {
      pollId,
    },
    distinct: ["userId"],
    select: {
      user: true,
    },
  });

  return users
    .filter((data) => data.user !== null)
    .map(({ user }) => user as NonNullable<typeof user>);
};

export const getPollUserAnswerChoice = async (
  userId: string,
  pollId: string
) => {
  const vote = await prisma.vote.findFirst({
    where: {
      pollId,
      userId,
    },
  });

  return vote;
};
