import { cn } from "@pollify/lib";
import { Button } from "@pollify/ui";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { routes } from "../config/routes";
import HeroImage from "../public/hero-image.png";

type Props = React.ComponentPropsWithoutRef<"section"> & {
  heading?: string;
  description?: string;
  stats: { amount: string; name: string }[];
};

export const Hero = ({
  heading = "Make Decisions Faster with Polling",
  description = "Collect real-time feedback and make quicker decisions with our easy-to-use polling tools. Get valuable insights instantly to guide your next steps.",
  stats,
  className,
  ...rest
}: Props) => {
  return (
    <section className={cn("container flex", className)} {...rest}>
      <div className="lg:bg-foreground lg:border-border flex w-full flex-col rounded-3xl lg:flex-row lg:space-x-6 lg:border lg:pl-12 xl:pl-24">
        <div className="mb-8 flex-1 lg:mb-12 lg:pt-24 xl:mb-24 xl:pt-24">
          <h1 className="mb-4 text-3xl font-medium lg:max-w-md lg:text-5xl">
            {heading}
          </h1>
          <p className="text-accent mb-6 lg:max-w-md">{description}</p>
          <div className="flex items-center space-x-3">
            <Button variant="primary" asChild>
              <Link href={routes.CREATE_POLL}>Create poll</Link>
            </Button>
            <Button variant="text">Learn more</Button>
          </div>

          <div className="mt-12 flex space-x-8">
            {stats.map((stat) => (
              <div key={stat.name} className="flex flex-col">
                <p className="text-xl font-semibold md:text-2xl">
                  {stat.amount}
                </p>
                <p className="text-accent text-xs md:text-sm">{stat.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-foreground border-border relative aspect-square flex-1 rounded-3xl border pl-8 pt-8 lg:aspect-auto lg:border-none lg:bg-none lg:p-0 lg:pr-12 xl:border-none xl:bg-none xl:pr-24">
          <Image
            src={HeroImage}
            className="h-full object-contain object-bottom lg:aspect-video"
            alt="hero"
            fill
            draggable="false"
            priority
          />
        </div>
      </div>
    </section>
  );
};
