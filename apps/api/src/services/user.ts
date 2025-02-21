import { prisma } from "@pollify/prisma/edge";
import type { User } from "@pollify/types";

export const updateUserData: User.Services["updateUser"] = async (
  userId,
  data
) => {
  console.log(data);
  const response = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      image: data.image,
      clockType: data.clockType,
      timeZone: data.timeZone,
      // TODO handle email change properly, do not update user email for now
      // ...data
    },
  });
  return response;
};

export const deleteUser: User.Services["deleteUser"] = async (userId) => {
  await prisma.user.delete({ where: { id: userId } });
  await prisma.vote.updateMany({
    where: { userId },
    data: { userId: "__deleted" },
  });
};

export const getUserPolls: User.Services["getUserPolls"] = async ({
  userId,
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
      userId: userId,
    },
    orderBy: {
      [sortBy]: orderBy,
    },
    include: { answers: true },
  });
  return {
    data: response.slice(0, limit),
    nextPage: response.length > limit ? page + 1 : undefined,
  };
};

// @ts-expect-error TODO fix
export const getUserVotes: User.Services["getUserVotes"] = async ({
  userId,
  page = 1,
  skip,
  limit = 10,
  orderBy = "desc",
  sortBy = "createdAt",
}) => {
  const response = await prisma.vote.findMany({
    skip: skip,
    take: limit + 1,
    where: {
      userId: userId,
    },
    orderBy: {
      [sortBy]: orderBy,
    },
    include: { poll: true, answer: true },
  });
  return {
    data: response.slice(0, limit),
    nextPage: response.length > limit ? page + 1 : undefined,
  };
};
