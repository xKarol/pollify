import { cn } from "@pollify/lib";
import { prisma } from "@pollify/prisma";
import { Button, Icon } from "@pollify/ui";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import { routes } from "../config/routes";
import { BaseLayout } from "../layouts";
import HeroImage from "../public/hero-image.png";
import { getLayout } from "../utils/get-layout";
import { nFormatter } from "../utils/misc";

type Stats = {
  totalPolls: number;
  totalVotes: number;
  totalUsers: number;
};

export const getStaticProps = (async () => {
  const stats = {
    totalPolls: await prisma.poll.count().catch(() => 0),
    totalVotes: await prisma.vote.count().catch(() => 0),
    totalUsers: await prisma.user.count().catch(() => 0),
  };
  return { props: { stats } };
}) satisfies GetStaticProps<{
  stats: Stats;
}>;

export default function HomePage({
  stats,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: session } = useSession();

  console.log({ session });

  return (
    <div className="mt-8 space-y-16 xl:mt-32 xl:space-y-32">
      <section className="flex flex-col items-center space-y-16">
        <div className="container flex max-w-4xl flex-col items-center space-y-4">
          <h1 className="text-center text-3xl font-semibold lg:text-5xl">
            Make your own Polling and Share easily with Poll
          </h1>
          <p className="max-w-2xl text-center font-medium text-neutral-500 lg:text-lg">
            Share your polling and receive your friend polling. It’s totally
            free for all and you can pay to get more feature on poll, poll have
            realtime for your polling and polling discover
          </p>
        </div>
        <div className="relative flex w-full">
          <div className="absolute left-1/2 top-1/2 -z-50 h-[1200px] w-screen max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.20)_0%,rgba(0,0,0,0.00)_70%)]"></div>
          <div className="container flex justify-center">
            <Image src={HeroImage} alt="hero" draggable="false" />
          </div>
        </div>
      </section>
      <section className="dark:bg-dark border-y-2 border-neutral-100 bg-white dark:border-neutral-800">
        <div className="container flex max-w-4xl flex-col items-center space-y-4 py-8 md:flex-row md:justify-between md:space-x-4 md:space-y-0">
          <div className="flex flex-1 flex-col items-center">
            <p className="text-4xl font-bold uppercase md:text-5xl">
              {nFormatter(stats.totalPolls)}
            </p>
            <p className="text-base font-semibold uppercase md:text-lg">
              Polls
            </p>
          </div>
          <div className="hidden h-[50px] w-[1px] bg-neutral-100 md:block dark:bg-neutral-800"></div>
          <div className="flex flex-1 flex-col items-center">
            <p className="text-4xl font-bold uppercase md:text-5xl">
              {nFormatter(stats.totalVotes)}
            </p>
            <p className="text-base font-semibold uppercase md:text-lg">
              Votes
            </p>
          </div>
          <div className="hidden h-[50px] w-[1px] bg-neutral-100 md:block dark:bg-neutral-800"></div>

          <div className="flex flex-1 flex-col items-center">
            <p className="text-4xl font-bold uppercase md:text-5xl">
              {nFormatter(stats.totalUsers)}
            </p>
            <p className="text-base font-semibold uppercase md:text-lg">
              Users
            </p>
          </div>
        </div>
      </section>
      <section className="container flex flex-col">
        <div className="mx-auto mb-16 flex max-w-3xl flex-col space-y-4">
          <h1 className="text-center text-2xl font-semibold xl:text-3xl">
            Explore the powerful features that make our poll website exceptional
          </h1>
          <p className="text-center font-medium text-neutral-500 xl:text-lg">
            Discover how our platform can elevate your polling experience
          </p>
        </div>
        <div className="flex flex-col gap-8 md:flex-row md:flex-wrap">
          <FeatureCard
            heading="User-Friendly Poll Creation"
            description="Easily create polls using a simple and intuitive interface. No technical skills required"
            Icon={<Icon.BarChart2 />}
            className="min-h-max w-full md:max-w-[calc((100%/2)-24px)] lg:max-w-[calc((100%/3)-32px)]"
          />
          <FeatureCard
            heading="Real-time Results"
            description="Watch poll results update in real time as participants cast their votes"
            Icon={<Icon.Radio />}
            className="min-h-max w-full md:max-w-[calc((100%/2)-24px)] lg:max-w-[calc((100%/3)-32px)]"
          />
          <FeatureCard
            heading="No Login Required"
            description="Create and participate in polls without the hassle of signing up or logging in."
            Icon={<Icon.LineChart />}
            className="min-h-max w-full md:max-w-[calc((100%/2)-24px)] lg:max-w-[calc((100%/3)-32px)]"
          />
          <FeatureCard
            heading="Customizable Poll Options"
            description="Gain insights from comprehensive data analytics to understand voting patterns and trends."
            Icon={<Icon.Settings2 />}
            className="min-h-max w-full md:max-w-[calc((100%/2)-24px)] lg:max-w-[calc((100%/3)-32px)]"
          />
          <FeatureCard
            heading="Detailed Analytics"
            description="Get valuable data and insights to make informed decisions with our detailed poll statistics"
            Icon={<Icon.LineChart />}
            className="min-h-max w-full md:max-w-[calc((100%/2)-24px)] lg:max-w-[calc((100%/3)-32px)]"
          />
          <FeatureCard
            heading="Share Polls Easily"
            description="Spread your polls through social media, email, or direct links to gather more responses."
            Icon={<Icon.Globe />}
            className="min-h-max w-full md:max-w-[calc((100%/2)-24px)] lg:max-w-[calc((100%/3)-32px)]"
          />
        </div>
      </section>
      <section className="dark:bg-dark border-y-2 border-neutral-100 bg-white py-16 dark:border-neutral-800">
        <div className="container flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold xl:text-3xl">
              Join the Poll Now!
            </h1>
            <p className="text-lg text-neutral-500 xl:text-xl">
              Start polling and engaging instantly.
            </p>
          </div>
          <Button asChild className="w-full rounded-full md:w-auto">
            <Link href={routes.CREATE_POLL}>Create a poll</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

HomePage.getLayout = getLayout(BaseLayout);

type FeatureCardProps = {
  heading: string;
  description: string;
  Icon: JSX.Element;
} & React.ComponentPropsWithoutRef<"div">;

function FeatureCard({
  heading,
  description,
  Icon,
  className,
  ...props
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "dark:bg-dark relative flex flex-col space-y-6 rounded border border-neutral-100 bg-white px-8 py-16 dark:border-neutral-800",
        className
      )}
      {...props}>
      <div className="[&>svg]:text-green-500">{Icon}</div>
      <div className="space-y-4">
        <h1 className="text-lg font-medium lg:text-xl">{heading}</h1>
        <p className="text-neutral-500">{description}</p>
      </div>
    </div>
  );
}
