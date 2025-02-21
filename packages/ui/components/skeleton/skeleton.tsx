import { cn } from "@pollify/lib";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded bg-neutral-100 dark:bg-neutral-800 [&_div]:bg-neutral-200 [&_div]:dark:bg-neutral-700",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
