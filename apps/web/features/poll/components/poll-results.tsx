import { cn } from "@pollify/lib";
import { CheckCircle2Icon } from "lucide-react";
import React from "react";

import { nFormatter } from "../../../utils/misc";

type PollResultsProps = {
  selectedOptionId: string | undefined;
  totalVotes: number;
  options: { id: string; text: string; votes: number }[];
} & React.ComponentPropsWithoutRef<"ul">;

export const PollResults = ({
  selectedOptionId,
  totalVotes,
  options,
  className,
  ...rest
}: PollResultsProps) => {
  return (
    <ul
      className={cn("flex flex-col space-y-3 lg:space-y-4", className)}
      {...rest}>
      {options
        .sort((a, b) => b.votes - a.votes)
        .map((option) => {
          const value = (option.votes / totalVotes) * 100;
          const percent = Number.isNaN(value) ? 0 : value;
          return (
            <li
              key={option.id}
              data-selected={selectedOptionId === option.id}
              className="bg-foreground border-border text-accent group relative z-10 overflow-hidden rounded-xl border p-4 data-[selected='true']:border-none data-[selected='true']:bg-[#98FB98]/20 data-[selected='true']:text-black lg:rounded-2xl lg:p-5">
              <div
                // @ts-ignore
                style={{ "--percent": percent / 100 }}
                className="bg-border group-data-[selected='true']:bg-primary absolute left-0 top-0 -z-10 size-full origin-left scale-x-[--percent] transition-transform duration-500 ease-in-out"></div>
              <div className="flex w-full items-center justify-between font-medium lg:text-lg">
                <div className="flex items-center space-x-2">
                  <span className="*:inline">
                    <span>
                      {option.text} · {nFormatter(option.votes)} votes
                    </span>
                    <CheckCircle2Icon
                      size={20}
                      className="ml-2 group-data-[selected='false']:hidden"
                    />
                  </span>
                </div>
                <span>{percent.toFixed(0)}%</span>
              </div>
            </li>
          );
        })}
    </ul>
  );
};
