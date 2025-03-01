import { gray } from "colorette";
import ms from "ms";
import ora from "ora";

import {
  clearDatabase,
  getContext,
  seedPolls,
  seedUsers,
  seedVotes,
} from "./seed.utils";

async function main() {
  const ctx = getContext();
  const steps = {
    "Clearing database...": clearDatabase,
    "Seeding users...": seedUsers,
    "Seeding polls...": seedPolls,
    "Seeding votes...": seedVotes,
  };

  const start = performance.now();
  console.log();

  for await (const [stepLabel, callback] of Object.entries(steps)) {
    ctx.spinner = ora(stepLabel).start();
    const start = performance.now();
    await callback(ctx)
      .catch((e) => {
        ctx.spinner.fail();
        throw e;
      })
      .then(() => {
        const time = Math.round(performance.now() - start);
        ctx.spinner.succeed(`${ctx.spinner.text} ${gray(ms(time))}`);
      });
  }

  const time = Math.round(performance.now() - start);
  ctx.spinner.succeed(`Finished seeding in ${gray(ms(time))}`);
  console.log();
  return ctx;
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });
