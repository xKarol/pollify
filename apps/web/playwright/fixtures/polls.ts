import { db } from "@pollify/db/edge";
import { polls } from "@pollify/db/schema";

export const createPollsFixture = () => {
  return {
    deleteAll: async () => {
      await db.delete(polls);
    },
  };
};
