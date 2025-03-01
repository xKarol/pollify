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
  apple: <Icon.Apple2 />,
  facebook: <Icon.Facebook2 />,
};

export default function AuthProvider({
  variant,
  isLoading,
  className,
  ...props
}: AuthProviderProps) {
  return (
    <LoadingButton
      isLoading={isLoading}
      type="button"
      variant="secondary"
      className={cn("space-x-4 rounded-xl py-5 [&_svg]:size-4", className)}
      {...props}>
      {isLoading ? null : variantIcons[variant]}
      <span>
        Continue with <span className="capitalize">{variant}</span>
      </span>
    </LoadingButton>
  );
}
