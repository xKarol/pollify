import { ScrollArea } from "@pollify/ui";
import { LineChartIcon, AlertOctagonIcon, Loader2 } from "lucide-react";
import React from "react";

import { cn } from "../../../../../packages/lib/cn";

type AnalyticsBoxProps = (React.ComponentPropsWithoutRef<"div"> & {
  name: string;
  isError: boolean;
  isEmpty: boolean;
  withScroll?: boolean;
}) &
  (
    | { isLoading: false }
    | { isLoading: true; SkeletonComponents?: React.ReactNode }
  );

const AnalyticsBox = ({
  isLoading,
  isError,
  isEmpty,
  name,
  className,
  children,
  withScroll = true,
  ...props
}: AnalyticsBoxProps) => {
  return (
    <div
      className={cn(
        "border-border bg-foreground flex flex-col space-y-4 rounded-xl border p-3",
        className
      )}
      {...props}>
      <h1 className="text-base font-medium">{name}</h1>
      <div className="flex h-full flex-col">
        {isLoading === true ? (
          // @ts-ignore
          props.SkeletonComponents ? (
            // @ts-ignore
            props.SkeletonComponents
          ) : (
            <div className="text-accent flex h-full flex-col items-center justify-center space-y-2 py-4">
              <Loader2 className="m-auto animate-spin" size={20} />
            </div>
          )
        ) : isError ? (
          <div className="text-accent flex h-full flex-col items-center justify-center space-y-2 py-4">
            <AlertOctagonIcon />
            <span className="text-xs">Something went wrong...</span>
          </div>
        ) : isEmpty ? (
          <div className="text-accent flex h-full flex-col items-center justify-center space-y-2 py-4">
            <LineChartIcon />
            <span className="text-xs">No data available</span>
          </div>
        ) : withScroll ? (
          <ScrollArea className="max-h-48">{children}</ScrollArea>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default AnalyticsBox;
