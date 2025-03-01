import { db } from "@pollify/db/edge";
import { polls, users, votes } from "@pollify/db/schema";
import { sql } from "drizzle-orm";
import type { AnyPgTable } from "drizzle-orm/pg-core";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

import { CTA } from "../components/cta";
import { FAQs } from "../components/faqs";
import { Features } from "../components/features";
import { Hero } from "../components/hero";
import { BaseLayout } from "../layouts";
import { getLayout } from "../utils/get-layout";
import { nFormatter } from "../utils/misc";

type Stats = {
  totalPollsAmount: string;
  totalVotesAmount: string;
  totalUsersAmount: string;
};

export const getStaticProps = (async () => {
  const safeCount = async (table: AnyPgTable) => {
    try {
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(table);
      return result[0]?.count ?? 0;
    } catch {
      return 0;
    }
  };

  const [totalPolls, totalVotes, totalUsers] = await Promise.all([
    safeCount(polls),
    safeCount(votes),
    safeCount(users),
  ]);

  const stats = {
    totalPollsAmount: `${nFormatter(totalPolls)}+`,
    totalVotesAmount: `${nFormatter(totalVotes)}+`,
    totalUsersAmount: `${nFormatter(totalUsers)}+`,
  };
  return { props: { stats } };
}) satisfies GetStaticProps<{
  stats: Stats;
}>;

export default function HomePage({
  stats,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Hero
        stats={[
          { amount: stats.totalPollsAmount, name: "Created Polls" },
          { amount: stats.totalVotesAmount, name: "Votes Submitted" },
          { amount: stats.totalUsersAmount, name: "Registered Users" },
        ]}
      />
      <Features />
      <FAQs />
      <CTA />
    </>
  );
}

HomePage.getLayout = getLayout(BaseLayout);
