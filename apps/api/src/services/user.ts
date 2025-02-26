import { User } from "@pollify/prisma/client";
import { prisma } from "@pollify/prisma/edge";
import { Services as UserServices } from "@pollify/types/user";

export const updateUserData = async (
  userId: string,
  data: Pick<User, "name" | "clockType" | "timeZone">
) => {
  const response = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      // image: data.image,
      clockType: data.clockType,
      timeZone: data.timeZone,
    },
  });
  return response;
};

export const deleteUser = async (userId: string) => {
  await prisma.user.delete({ where: { id: userId } });
  await prisma.vote.updateMany({
    where: { userId },
    data: { userId: "__deleted" },
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

export const getUserVotes: UserServices["getUserVotes"] = async ({
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
