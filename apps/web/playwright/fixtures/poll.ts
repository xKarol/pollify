import { prisma } from "@poll/prisma";

export const createPollFixture = () => {
  return {
    deleteAll: async () => {
      await prisma.poll.deleteMany({});
    },
  };
};
