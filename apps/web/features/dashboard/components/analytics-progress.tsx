import { cn } from "@pollify/lib";
import React from "react";

import { nFormatter } from "../../../utils/misc";

type AnalyticsProgressProps = Omit<
  React.ComponentPropsWithoutRef<"div"> & {
    text: string;
    leftIcon: React.ReactNode;
    total: number;
    value: number;
    max: number;
  },
  "children"
>;

const AnalyticsProgress = ({
  text,
  leftIcon,
  total,
  value,
  max,
  className,
  ...props
}: AnalyticsProgressProps) => {
  const percent = Math.round((value / total) * 100).toFixed(2);
  return (
    <div
      className={cn(
        "bg-foreground/25 relative z-10 flex w-full items-center justify-between overflow-hidden rounded-lg p-2 text-xs",
        className
      )}
      {...props}>
      <div
        style={{
          //   @ts-ignore
          "--percent": Math.round((value / max) * 100).toFixed(2) / 100,
        }}
        className="bg-primary/5 absolute left-0 top-0 -z-10 size-full origin-left scale-x-[--percent] transition-transform"></div>
      <div className="flex items-center space-x-2">
        {leftIcon}
        <span>{text}</span>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-accent text-xs">{percent}%</span>
        <span className="text-xs font-medium">{nFormatter(value)}</span>
      </div>
    </div>
  );
};

export default AnalyticsProgress;
