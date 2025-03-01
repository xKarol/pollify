/* eslint-disable no-empty-pattern */
import { test as base } from "@playwright/test";

import { createDatabaseFixture } from "./db";
import { createPollsFixture } from "./polls";

export type Fixtures = {
  db: ReturnType<typeof createDatabaseFixture>;
  polls: ReturnType<typeof createPollsFixture>;
};

export const test = base.extend<Fixtures>({
  db: async ({}, use) => {
    await use(createDatabaseFixture());
  },
  polls: async ({}, use) => {
    await use(createPollsFixture());
  },
});
