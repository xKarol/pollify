import { prisma } from "@pollify/prisma";

export const createPrismaFixture = () => {
  return prisma;
};
