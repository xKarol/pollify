import { cn } from "@pollify/lib";
import Image from "next/image";
import React, { useId, useRef } from "react";

import { Label } from "../../../components/label";
import { RadioGroupItem } from "../../../components/radio-group";
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
  const radioRef = useRef(null);

  const triggerCheck = () => {
    if (radioRef.current) {
      radioRef.current.click();
    }
  };

  return (
    <div
      className={cn(
        "cursor-pointer rounded border border-neutral-200 dark:border-neutral-700/50",
        isActive && "outline outline-2 outline-neutral-900 dark:outline-white",
        className
      )}
      onClick={triggerCheck}
      {...props}>
      <div className="flex h-[200px] w-full items-center justify-center bg-neutral-200 px-6 py-4 dark:bg-neutral-800">
        <Image
          src={variantPreview[variant]}
          alt={`${variant} theme preview`}
          draggable={false}
        />
      </div>
      <div className="flex items-center space-x-2 p-4 text-sm">
        {React.cloneElement(RadioInput, { id, ref: radioRef })}
        <Label className="text-sm capitalize" htmlFor={id}>
          {variant} theme
        </Label>
      </div>
    </div>
  );
}

export default ThemeCard;
