import { cn } from "@pollify/lib";
import { Icon } from "@pollify/ui";
import Image, { type StaticImageData } from "next/image";
import React from "react";

import featureImageAnalyze from "../public/feature-analyze.png";
import featureImageCreate from "../public/feature-create.png";
import featureImageVote from "../public/feature-vote.png";

type Props = React.ComponentPropsWithoutRef<"section">;

export const Features = ({ className, ...rest }: Props) => {
  return (
    <section className={cn("container flex flex-col", className)} {...rest}>
      <div className="mx-auto mb-16 flex max-w-3xl flex-col space-y-4">
        <h1 className="text-center text-2xl font-medium xl:text-3xl">
          Explore the powerful features that make our poll website exceptional
        </h1>
        <p className="text-accent text-center xl:text-lg">
          Discover how our platform can elevate your polling experience
        </p>
      </div>
      <div className="flex flex-col space-y-12">
        <FeatureCard
          label="Participate"
          heading="Every Voice Matters"
          description="Join a dynamic platform where every vote matters. Participate in polls and shape decisions in real-time."
          image={{ src: featureImageVote, alt: "" }}
          subfeatures={[
            { icon: <Icon.BarChart2 />, text: "Vote on trending topics" },
            {
              icon: <Icon.MessageSquareText />,
              text: "Discuss results with the community",
            },
            {
              icon: <Icon.Radio />,
              text: "See live poll analytics",
            },
            {
              icon: <Icon.Bell />,
              text: "Get notified about new polls",
            },
          ]}
        />
        <FeatureCard
          side="right"
          label="Create"
          heading="Ask the Right Questions"
          description="Effortlessly create and share engaging polls to gather insights from your audience."
          image={{ src: featureImageCreate, alt: "" }}
          subfeatures={[
            { icon: <Icon.SlidersHorizontal />, text: "Edit poll settings" },
            {
              icon: <Icon.Share2 />,
              text: "Share easily across platforms",
            },
            {
              icon: <Icon.CalendarClock />,
              text: "Schedule polls for later",
            },
            {
              icon: <Icon.UserRoundX />,
              text: "No account is required",
            },
          ]}
        />
        <FeatureCard
          label="Analyze"
          heading="Turn Data into Insights"
          description="Gain valuable insights from your polls with powerful analytics."
          image={{ src: featureImageAnalyze, alt: "" }}
          subfeatures={[
            {
              icon: <Icon.Activity />,
              text: "Track voting patterns in real-time",
            },
            {
              icon: <Icon.Filter />,
              text: "Filter responses by key demographics",
            },
            {
              icon: <Icon.ChartLine />,
              text: "Compare results over time",
            },
            {
              icon: <Icon.Download />,
              text: "Export data for deeper analysis",
            },
          ]}
        />
      </div>
    </section>
  );
};

type FeatureCardProps = {
  side?: "left" | "right";
  label: string;
  heading: string;
  description: string;
  subfeatures: { icon: JSX.Element; text: string }[];
  image: { src: StaticImageData; alt: string };
} & React.ComponentPropsWithoutRef<"div">;

function FeatureCard({
  label,
  heading,
  description,
  side = "left",
  subfeatures,
  image,
  className,
  ...props
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-8 md:flex-row md:items-center lg:gap-16",
        className
      )}
      {...props}>
      <div
        className={cn(
          "order-1 w-full md:order-none",
          side === "right" && "md:order-1"
        )}>
        <div className="mb-10 flex flex-col">
          <p className="text-primary mb-3 font-medium">{label}</p>
          <h1 className="mb-2 text-2xl font-medium md:text-3xl">{heading}</h1>
          <p className="text-accent max-w-xl md:text-lg">{description}</p>
        </div>
        <ul className="space-y-3 md:space-y-6">
          {subfeatures.map((subfeature) => (
            <li
              key={subfeature.text}
              className="[&_svg]:text-primary flex items-center space-x-3 font-medium">
              {subfeature.icon}
              <span>{subfeature.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-border bg-foreground relative mb-8 aspect-square w-full overflow-hidden rounded-2xl border md:mb-0 md:max-w-md lg:h-[30rem]">
        <Image
          src={image.src}
          alt={image.alt}
          className="w-full object-contain object-bottom"
          fill
        />
      </div>
    </div>
  );
}
