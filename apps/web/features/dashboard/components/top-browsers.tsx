import { Skeleton } from "@pollify/ui";
import Image from "next/image";
import React from "react";

import { useAnalyticsContext } from "../context";
import { useAnalyticsBrowsers } from "../hooks";
import AnalyticsBox from "./analytics-box";
import AnalyticsProgress from "./analytics-progress";

type TopBrowsersProps = React.ComponentPropsWithoutRef<"div">;

export default function TopBrowsers({ ...props }: TopBrowsersProps) {
  const { interval, pollId } = useAnalyticsContext();
  const { data, isSuccess, isError, isLoading } = useAnalyticsBrowsers({
    pollId,
    interval: interval,
  });
  const isEmpty = isSuccess && data.data.length === 0;

  return (
    <AnalyticsBox
      name="Top browsers"
      isError={isError}
      isLoading={isLoading}
      isEmpty={isEmpty}
      SkeletonComponents={
        <div className="flex flex-col space-y-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              className="flex w-full items-center justify-between px-4 py-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-10" />
            </Skeleton>
          ))}
        </div>
      }
      {...props}>
      <div className="flex flex-col space-y-1">
        {data?.data.map(({ browser_name, browser_version, amount, date }) => (
          <AnalyticsProgress
            key={date}
            text={`${browser_name} • ${browser_version}`}
            leftIcon={
              <Image
                width={16}
                height={12}
                src={`/browsers/${browser_name.toLowerCase()}.png`}
                alt={`${browser_name} browser`}
              />
            }
            max={data.metrics.max}
            value={amount}
            total={data.total}
          />
        ))}
      </div>
    </AnalyticsBox>
  );
}
