import { cn } from "@pollify/lib";
import React from "react";

import logoTextLight from "../../../../apps/web/public/logo-with-label-dark.svg";
import logoTextDark from "../../../../apps/web/public/logo-with-label-light.svg";
import logo from "../../../../apps/web/public/logo.svg";

export type LogoProps = {
  href?: string | null;
  variant?: "default" | "text";
} & React.ComponentPropsWithoutRef<"div">;

export const Logo = ({
  href = "/",
  variant = "default",
  className,
  ...rest
}: LogoProps) => {
  const Component = href === null ? React.Fragment : "a";

  return (
    <div className={cn("w-max", className)} {...rest}>
      <Component {...(href && { href: href })}>
        {variant === "text" ? (
          <>
            <img
              src={logoTextLight.src}
              className="hidden dark:block"
              alt="logo"
            />
            <img
              src={logoTextDark.src}
              className="block dark:hidden"
              alt="logo"
            />
          </>
        ) : (
          <img src={logo.src} alt="logo" />
        )}
      </Component>
    </div>
  );
};
