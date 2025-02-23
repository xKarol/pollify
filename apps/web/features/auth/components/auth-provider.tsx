import { cn } from "@pollify/lib";
import { Icon, LoadingButton } from "@pollify/ui";
import React from "react";

import type { Providers } from "../types";

type AuthProviders = Exclude<Providers, "credentials">;

export type AuthProviderProps = { variant: AuthProviders } & Omit<
  React.ComponentProps<typeof LoadingButton>,
  "variant"
>;

const variantIcons: Record<AuthProviders, JSX.Element> = {
  google: <Icon.Google />,
};

export default function AuthProvider({
  variant,
  isLoading,
  className,
  ...props
}: AuthProviderProps) {
  return (
    <LoadingButton
      isLoading={false}
      type="button"
      variant="secondary"
      className={cn(
        "space-x-4 rounded-xl bg-[#d9d9d9] py-5 hover:bg-[#d9d9d9]/80 dark:bg-[#262626] dark:text-white dark:hover:bg-[#262626]/50",
        isLoading && "animate-pulse opacity-75 [&_svg:last-child]:hidden",
        className
      )}
      {...props}>
      {variantIcons[variant]}
      <span>
        Continue with <span className="capitalize">{variant}</span>
      </span>
    </LoadingButton>
  );
}
