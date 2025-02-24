import { cn } from "@pollify/lib";
import { RadioGroup } from "@pollify/ui";
import React from "react";

import { PollOption } from "./poll-option";

export type PollOptionsProps = {
  selectedOptionId: string | undefined;
  onSelectOption: React.Dispatch<React.SetStateAction<string | undefined>>;
  options: { id: string; text: string }[];
} & Omit<
  React.ComponentProps<typeof RadioGroup>,
  "children" | "value" | "onValueChange"
>;

export const PollOptions = ({
  selectedOptionId,
  onSelectOption,
  options,
  className,
  ...rest
}: PollOptionsProps) => {
  return (
    <RadioGroup
      value={selectedOptionId}
      onValueChange={(value) => onSelectOption(value)}
      className={cn("flex flex-col space-y-3 lg:space-y-3", className)}
      {...rest}>
      {options.map((option) => (
        <PollOption optionId={option.id} text={option.text} key={option.id} />
      ))}
    </RadioGroup>
  );
};
