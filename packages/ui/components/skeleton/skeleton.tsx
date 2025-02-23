import { cn } from "@pollify/lib";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-foreground animate-pulse rounded-xl [&_div]:bg-neutral-200 [&_div]:dark:bg-neutral-800",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
