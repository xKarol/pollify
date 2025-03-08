import { cn } from "@pollify/lib";
import { Button, Icon } from "@pollify/ui";
import React from "react";

type MobileHeaderProps = {
  MenuComponent?: JSX.Element;
  onOpen?: () => void;
} & Omit<React.ComponentPropsWithoutRef<"header">, "children">;

export function DashboardMobileHeader({
  MenuComponent = <Icon.Menu />,
  onOpen,
  className,
  ...props
}: MobileHeaderProps) {
  return (
    <header
      className={cn(
        "border-border bg-background container fixed left-0 right-0 top-0 z-50 flex max-w-5xl items-center border py-2",
        className
      )}
      {...props}>
      <Button
        variant="text"
        className="hover:bg-border rounded-lg p-4"
        onClick={onOpen}
        asChild>
        {MenuComponent}
      </Button>
    </header>
  );
}
