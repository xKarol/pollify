import { cn } from "@pollify/lib";
import { Icon } from "@pollify/ui";
import numeral from "numeral";
import React from "react";

import { nFormatter } from "../../../utils/misc";

export type AnalyticsCardProps = {
  heading: string;
  StatIcon: JSX.Element;
  statsValue: number;
  lastMonthValue: number;
} & React.ComponentPropsWithoutRef<"section">;

export default function AnalyticsCard({
  StatIcon,
  heading,
  statsValue,
  lastMonthValue,
  className,
}: AnalyticsCardProps) {
  const percent = (statsValue - lastMonthValue) / lastMonthValue;
  const monthDiffPercent = pFormatter(percent);
  const status =
    percent > 0 ? "increase" : percent < 0 ? "decrease" : "neutral";
  return (
    <section
      className={cn(
        "border-border bg-foreground rounded-xl border p-6",
        className
      )}>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-sm font-medium">{heading}</h1>
        {StatIcon}
      </div>
      <h2 className="text-xl font-medium">{nFormatter(statsValue)}</h2>
      <p className="text-accent flex items-center space-x-1 text-xs">
        {status === "increase" && (
          <Icon.ArrowUpRight className="size-3 text-green-400" />
        )}
        {status === "decrease" && (
          <Icon.ArrowDownRight className="size-3 text-red-400" />
        )}
        <span>{monthDiffPercent} from last month</span>
      </p>
    </section>
  );
}

function pFormatter(percent: number) {
  return numeral(percent).format("+0.[00]a%").toUpperCase();
}
