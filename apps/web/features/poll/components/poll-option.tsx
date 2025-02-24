import { cn } from "@pollify/lib";
import { RadioGroupItem } from "@pollify/ui";
import React, { useId } from "react";

import { Label } from "../../../components/label";

export type PollOptionProps = {
  optionId: string;
  text: string;
} & React.ComponentPropsWithoutRef<"div">;

export const PollOption = ({
  optionId,
  text,
  className,
  ...rest
}: PollOptionProps) => {
  const id = useId();
  return (
    <div
      className={cn(
        "bg-foreground border-border rounded-xl border lg:rounded-2xl",
        className
      )}
      {...rest}>
      <Label className="flex items-center space-x-3 p-5 lg:p-6" htmlFor={id}>
        <RadioGroupItem
          className="data-[state='checked']:border-primary data-[state='checked']:text-primary size-5 [&_svg]:size-3"
          value={optionId}
          id={id}
        />
        <span>{text}</span>
      </Label>
    </div>
  );
};
