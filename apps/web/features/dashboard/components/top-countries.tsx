import { Skeleton } from "@pollify/ui";
import Image from "next/image";
import React from "react";

import { useAnalyticsContext } from "../context";
import { useAnalyticsCountries } from "../hooks";
import AnalyticsBox from "./analytics-box";
import AnalyticsProgress from "./analytics-progress";

type TopCountriesProps = React.ComponentPropsWithoutRef<"div">;

export default function TopCountries({ ...props }: TopCountriesProps) {
  const { interval, pollId } = useAnalyticsContext();
  const { data, isSuccess, isError, isLoading } = useAnalyticsCountries({
    pollId,
    interval: interval,
  });
  const isEmpty = isSuccess && data.data.length === 0;

  return (
    <AnalyticsBox
      name="Top countries"
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
        {data?.data.map(({ country_name, country_code, amount, date }) => (
          <AnalyticsProgress
            key={date}
            text={country_name}
            leftIcon={
              <Image
                width={16}
                height={12}
                src={`/flags/${country_code.toLowerCase()}.svg`}
                alt={`${country_name} flag`}
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
