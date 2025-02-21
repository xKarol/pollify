import { cn } from "@pollify/lib";
import React from "react";

import type { Avatar } from "./avatar";

type AvatarGroupProps = {
  max?: number;
  spacing?: string;
  children:
    | React.ReactElement<typeof Avatar>
    | React.ReactElement<typeof Avatar>[];
} & Omit<React.ComponentPropsWithoutRef<"div">, "children">;

export function AvatarGroup({
  max = 4,
  spacing = "1rem",
  className,
  children,
  ...props
}: AvatarGroupProps) {
  return (
    <div
      // @ts-expect-error
      style={{ "--spacing": spacing }}
      className={cn("flex -space-x-[--spacing]", className)}
      {...props}>
      {React.Children.toArray(children).slice(0, max)}
    </div>
  );
}
