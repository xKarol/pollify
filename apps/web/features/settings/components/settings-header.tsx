import { cn } from "@pollify/lib";
import React from "react";

type SettingsHeaderProps = {
  heading: string;
  description?: string;
} & Omit<React.ComponentPropsWithoutRef<"div">, "children">;

export default function SettingsHeader({
  heading,
  description,
  className,
  ...props
}: SettingsHeaderProps) {
  return (
    <div className={cn("flex justify-between", className)} {...props}>
      <div>
        <h1 className="text-lg font-medium">{heading}</h1>
        <p className="text-sm font-normal text-neutral-400 dark:text-neutral-300">
          {description}
        </p>
      </div>
      {/* add here buttons from props */}
    </div>
  );
}
