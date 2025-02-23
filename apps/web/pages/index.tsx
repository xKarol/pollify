import { prisma } from "@pollify/prisma";
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
  const stats = {
    totalPollsAmount: `${nFormatter(
      await prisma.poll.count().catch(() => 0)
    )}+`,
    totalVotesAmount: `${nFormatter(
      await prisma.vote.count().catch(() => 0)
    )}+`,
    totalUsersAmount: `${nFormatter(
      await prisma.user.count().catch(() => 0)
    )}+`,
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
