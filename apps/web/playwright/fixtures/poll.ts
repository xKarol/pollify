import { prisma } from "@pollify/prisma";

export const createPollFixture = () => {
  return {
    deleteAll: async () => {
      await prisma.poll.deleteMany({});
    },
  };
};
