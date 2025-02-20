import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import type { Poll, Answer, User, PrismaPromise } from "@prisma/client";
import he from "he";
import shuffle from "lodash.shuffle";
import type { Ora } from "ora";
import ora from "ora";

export type Context = {
  prisma: PrismaClient;
  spinner: Ora;
  polls: Poll[];
  users: User[];
};

export function getContext(): Context {
  const prisma = new PrismaClient();

  return {
    prisma: prisma,
    spinner: ora(),
    users: [],
    polls: [],
  };
}

function getFakeDate() {
  const createdAt = faker.date.past();
  return {
    createdAt: createdAt,
    updatedAt: faker.datatype.boolean()
      ? createdAt
      : faker.date.between({ from: createdAt, to: Date.now() }),
  };
}

export async function getPollsData(
  limit: number = 25
): Promise<ReturnType<typeof generateFakePollData>[]> {
  try {
    const res = await fetch(
      `https://opentdb.com/api.php?amount=${limit}&category=9&difficulty=medium&type=multiple`
    );
    const data = await res.json();
    const results = data.results;
    return Array.from({ length: results.length }, generateFakePollData).map(
      (poll, index) => {
        const result = results[index];
        const answers = shuffle([
          result.correct_answer,
          ...result.incorrect_answers,
        ]);

        return {
          ...poll,
          question: he.decode(result.question),
          answers: poll.answers.map((answer, index) => ({
            ...answer,
            text: answers[index] as string,
          })),
        };
      }
    );
  } catch {
    console.log("WARN: API doesn't response. Using fake data...");
    return Array.from({ length: limit }, generateFakePollData);
  }
}

export function generateFakePollData(isPublic: boolean = true) {
  const data: Omit<Poll, "userId" | "id"> & {
    answers: Omit<Answer, "id" | "pollId">[];
  } = {
    question: faker.lorem.sentence(),
    answers: Array.from({ length: 4 }, generateFakePollAnswerData),
    isPublic: isPublic,
    requireRecaptcha: faker.datatype.boolean(),
    ...getFakeDate(),
  };
  return data;
}

export function generateFakePollAnswerData() {
  const data: Omit<Answer, "id" | "pollId"> = {
    text: faker.datatype.boolean()
      ? faker.lorem.word()
      : faker.lorem.sentence(),
    votes: 0,
    ...getFakeDate(),
  };
  return data;
}

export function generateFakeUserData() {
  const data: Omit<User, "id"> = {
    email: faker.internet.email(),
    name: faker.internet.displayName(),
    emailVerified: faker.date.past(),
    image: faker.image.avatar(),
    plan: faker.helpers.arrayElement(["FREE", "BASIC", "PRO"]),
    timeZone: faker.location.timeZone(),
    clockType: 12,
    ...getFakeDate(),
  };
  return data;
}

export const seedUsers = async (ctx: Context) => {
  const totalUsers = faker.number.int({ min: 100, max: 500 });

  const data = Array.from({ length: totalUsers }, generateFakeUserData);
  const { count } = await ctx.prisma.user.createMany({
    data: data,
  });
  const users = await ctx.prisma.user.findMany({});
  ctx.users = users;

  ctx.spinner.text = `Created ${count} users`;
};

export const seedPolls = async (ctx: Context) => {
  if (ctx.users.length === 0) {
    ctx.spinner.fail("No users found. Please seed users first.");
    return;
  }

  const totalPolls = faker.number.int({ min: 100, max: 150 });
  const data = await getPollsData(totalPolls);

  const transactions: PrismaPromise<unknown>[] = [];
  for (const pollData of data) {
    transactions.push(
      ctx.prisma.poll.create({
        data: {
          userId: faker.datatype.boolean()
            ? ctx.users[Math.floor(Math.random() * ctx.users.length)].id
            : undefined,
          ...pollData,
          question: pollData.question,
          answers: {
            createMany: {
              data: pollData.answers,
            },
          },
        },
      })
    );
  }

  await ctx.prisma.$transaction(transactions);
  const polls = await ctx.prisma.poll.findMany({ include: { answers: true } });
  ctx.polls = polls;

  ctx.spinner.text = `Created ${polls.length} polls`;
};

export const seedVotes = async (ctx: Context) => {
  if (ctx.users.length === 0) {
    ctx.spinner.fail("No users found. Please seed users first.");
    return;
  }
  if (ctx.polls.length === 0) {
    ctx.spinner.fail("No polls found. Please seed polls first.");
    return;
  }
  const transactions: PrismaPromise<unknown>[] = [];
  for await (const poll of ctx.polls) {
    const totalVotes = faker.number.int({ min: 0, max: 200 });
    transactions.push(
      ctx.prisma.poll.update({
        where: {
          id: poll.id,
        },
        data: {
          vote: {
            createMany: {
              data: Array.from({ length: totalVotes }, () => ({
                answerId:
                  // @ts-expect-error
                  poll.answers[Math.floor(Math.random() * poll.answers.length)]
                    .id,
                userId:
                  ctx.users[Math.floor(Math.random() * ctx.users.length)].id,
              })),
            },
          },
          totalVotes: { increment: totalVotes },
        },
      })
    );
    // transactions.push(
    //   ctx.prisma.answer.update({
    //     where: {
    //       id: answerId,
    //     },
    //     data: {
    //       votes: { increment: 1 },
    //     },
    //   })
    // );
  }
  await ctx.prisma.$transaction(transactions);
  const totalVotes = await ctx.prisma.vote.count();
  ctx.spinner.text = `Created ${totalVotes} votes`;
};

export const clearDatabase = async (ctx: Context) => {
  const { count: countPolls } = await ctx.prisma.poll.deleteMany({});
  const { count: countUsers } = await ctx.prisma.user.deleteMany({});
  const total = countPolls + countUsers;
  ctx.spinner.text = `Database has been cleared. (${total} records removed)`;
};
