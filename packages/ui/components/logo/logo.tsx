import { cn } from "@pollify/lib";
import React from "react";

import { LogoSVG, LogoWithTextSVG } from "./svg";

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
        {variant === "text" ? <LogoWithTextSVG /> : <LogoSVG />}
      </Component>
    </div>
  );
};
