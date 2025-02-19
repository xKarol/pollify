import { prisma } from "@poll/prisma";

export const createPrismaFixture = () => {
  return prisma;
};
