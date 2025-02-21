import type { Answer } from "@pollify/prisma/client";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import React, { useMemo } from "react";

import { AnswerItem } from "../../../components/answer-item";
import { RadioGroup } from "../../../components/radio-group";

type PollAnswerOptionsProps = {
  options: Answer[];
  selectedOptionId: string;
} & Omit<React.ComponentProps<typeof RadioGroup>, "children">;

export const PollAnswerOptions = ({
  options,
  selectedOptionId,
  ...props
}: PollAnswerOptionsProps) => {
  const isVoted = !!selectedOptionId;
  const sortedAnswers = useMemo(
    () =>
      options.sort((a, b) => {
        return b.votes - a.votes;
      }),
    [options]
  );

  const totalVotes = options.reduce((acc, curr) => acc + curr.votes, 0);

  const calcPercent = (votes: number) => {
    const percent = (votes / totalVotes) * 100;
    return Number.isNaN(percent) || !Number.isFinite(percent) ? 0 : percent;
  };

  return (
    <RadioGroup className="my-10 flex flex-col" {...props}>
      {sortedAnswers.map((answer) => (
        <AnswerItem
          variant={
            selectedOptionId === answer.id
              ? "selected"
              : isVoted
              ? "result"
              : "default"
          }
          key={answer.id}
          text={answer.text}
          value={calcPercent(answer.votes)}
          RadioComponent={
            <RadioGroupPrimitive.Item
              value={answer.id}
              className="aspect-square h-[30px] w-[30px] rounded-full border-[3px] border-neutral-300 text-white ring-offset-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state='checked']:border-black data-[state='checked']:bg-black dark:border-neutral-700 dark:text-black dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 data-[state='checked']:dark:border-white data-[state='checked']:dark:bg-white">
              <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                <svg
                  className="h-4 w-4 text-current"
                  width="17"
                  height="15"
                  viewBox="0 0 17 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M15.837 3.11839L7.87326 13.574C7.71092 13.7849 7.50245 13.9558 7.26381 14.0736C7.02518 14.1914 6.76273 14.253 6.4966 14.2537C6.23191 14.2551 5.97037 14.1962 5.73184 14.0815C5.49331 13.9667 5.28404 13.7992 5.11994 13.5915L0.867974 8.17196C0.727236 7.99117 0.62348 7.78444 0.562639 7.56355C0.501798 7.34267 0.485061 7.11197 0.513378 6.88462C0.541696 6.65726 0.614515 6.43772 0.727681 6.23851C0.840846 6.0393 0.992144 5.86433 1.17293 5.72359C1.53804 5.43936 2.00112 5.31181 2.46027 5.369C2.68762 5.39731 2.90717 5.47013 3.10638 5.5833C3.30559 5.69647 3.48056 5.84776 3.6213 6.02855L6.46175 9.65318L13.0488 0.940129C13.1884 0.757055 13.3627 0.603268 13.5617 0.48755C13.7607 0.371832 13.9806 0.296448 14.2088 0.265703C14.4369 0.234958 14.6689 0.249454 14.8915 0.308362C15.114 0.367271 15.3228 0.469439 15.5059 0.609033C15.689 0.748627 15.8428 0.922915 15.9585 1.12194C16.0742 1.32097 16.1496 1.54084 16.1803 1.769C16.2111 1.99716 16.1966 2.22914 16.1377 2.4517C16.0788 2.67426 15.9766 2.88304 15.837 3.06611V3.11839Z"
                    fill="currentColor"
                  />
                </svg>
              </RadioGroupPrimitive.Indicator>
            </RadioGroupPrimitive.Item>
          }
        />
      ))}
    </RadioGroup>
  );
};
