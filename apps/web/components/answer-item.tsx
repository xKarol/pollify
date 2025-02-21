import { cn } from "@pollify/lib";
import { Progress } from "@pollify/ui";
import { CheckCircle2 } from "lucide-react";
import React, { useId } from "react";

import { Label } from "./label";

type AnswerItemVariants = "default" | "result" | "selected";

export type AnswerItemProps = {
  variant?: AnswerItemVariants;
  text: string;
  value: number;
  RadioComponent: JSX.Element;
} & React.ComponentPropsWithoutRef<"div">;

export const AnswerItem = ({
  RadioComponent,
  text,
  value,
  variant = "default",
  className,
  ...rest
}: AnswerItemProps) => {
  const showProgressElement = variant === "result" || variant === "selected";
  const showPercentage = variant === "result" || variant === "selected";
  const id = useId();
  return (
    <div
      className={cn(
        "flex space-x-4 px-4 py-3",
        variant === "selected" &&
          "rounded border border-neutral-900 dark:border-green-500",
        className
      )}
      {...rest}>
      <div className="flex justify-end">
        {showPercentage && (
          <span className="my-auto text-end text-lg font-normal md:text-xl">
            {value.toFixed(0)}%
          </span>
        )}
        {variant === "default" && React.cloneElement(RadioComponent, { id })}
      </div>
      <div className="flex w-full flex-col justify-center space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium" htmlFor={id}>
            {text}
          </Label>
          {variant === "selected" && (
            <CheckCircle2 className="text-neutral-900 dark:text-green-500" />
          )}
        </div>
        {showProgressElement && (
          <Progress
            value={value}
            className={cn(
              variant === "selected" &&
                "bg-neutral-900/5 dark:bg-green-500/5 [&>*]:bg-neutral-900 [&>*]:dark:bg-green-500"
            )}
          />
        )}
      </div>
    </div>
  );
};
