import { cn } from "@pollify/lib";
import { RadioGroupItem } from "@pollify/ui";
import Image from "next/image";
import React, { useId } from "react";

import { Label } from "../../../components/label";
import darkThemePreview from "../../../public/dark-theme-preview.svg";
import lightThemePreview from "../../../public/light-theme-preview.svg";
import systemThemePreview from "../../../public/system-theme-preview.svg";

type Props = {
  variant: "dark" | "light" | "system";
  isActive?: boolean;
  RadioInput?: JSX.Element;
} & Omit<React.ComponentPropsWithoutRef<"div">, "children">;

const variantPreview = {
  light: lightThemePreview,
  dark: darkThemePreview,
  system: systemThemePreview,
};

function ThemeCard({
  isActive,
  variant,
  RadioInput = <RadioGroupItem value={variant} />,
  className,
  ...props
}: Props) {
  const id = useId();

  return (
    <div
      className={cn(
        "border-border cursor-pointer overflow-hidden rounded-xl border",
        isActive && "outline outline-2 outline-neutral-900 dark:outline-white",
        className
      )}
      {...props}>
      <Label htmlFor={id}>
        <div className="bg-foreground flex h-[200px] w-full items-center justify-center px-6 py-4">
          <Image
            src={variantPreview[variant]}
            alt={`${variant} theme preview`}
            draggable={false}
          />
        </div>
        <div className="flex items-center space-x-2 p-4 text-sm">
          {React.cloneElement(RadioInput, { id })}
          <span className="text-sm capitalize">{variant} theme</span>
        </div>
      </Label>
    </div>
  );
}

export default ThemeCard;
