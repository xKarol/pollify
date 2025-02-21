import { cn } from "@pollify/lib";
import { Skeleton } from "@pollify/ui";
import React from "react";

type SkeletonLoadingProps = React.ComponentPropsWithoutRef<"div">;

export const SkeletonLoading = ({
  className,
  ...props
}: SkeletonLoadingProps) => {
  return (
    <div className={cn("space-y-16", className)} {...props}>
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-5 w-80" />
      </div>
      <div className="space-y-4 pl-4">
        <Skeleton className="h-12 w-6/12" />
        <Skeleton className="h-12 w-8/12" />
        <Skeleton className="h-12 w-7/12" />
        <Skeleton className="h-12 w-5/12" />
      </div>
      <div>
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  );
};
