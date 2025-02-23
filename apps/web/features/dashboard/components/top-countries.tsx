import { cn } from "@pollify/lib";
import { Icon, Skeleton } from "@pollify/ui";
import Image from "next/image";
import React from "react";

import { nFormatter } from "../../../utils/misc";
import { useAnalyticsContext } from "../context";
import { useAnalyticsTopCountries } from "../hooks";

type TopCountriesProps = React.ComponentPropsWithoutRef<"div">;

export default function TopCountries({
  className,
  ...props
}: TopCountriesProps) {
  const { interval, pollId } = useAnalyticsContext();
  const { data, isSuccess, isError, isLoading } = useAnalyticsTopCountries({
    pollId,
    interval: interval,
  });
  const isEmpty = isSuccess && data.length === 0;
  return (
    <div className={cn("flex flex-col space-y-2", className)} {...props}>
      <h1 className="text-sm font-medium">Top countries</h1>
      <div className="flex max-h-[192px] flex-col overflow-y-auto">
        {isError && (
          <div className="flex">
            <span className="text-accent mx-auto my-10 text-xs">
              Something went wrong...
            </span>
          </div>
        )}
        {isEmpty && (
          <div className="flex">
            <span className="text-accent mx-auto my-10 text-xs">
              No data available
            </span>
          </div>
        )}
        {isLoading && (
          <div className="flex flex-col space-y-1">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                className="flex w-full items-center justify-between px-4 py-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-10" />
              </Skeleton>
            ))}
          </div>
        )}
        {isSuccess && (
          <div className="flex flex-col space-y-1">
            {data.map(({ country_name, country_code, total }) => (
              <Country
                key={country_code}
                countryName={country_name}
                countryCode={country_code}
                value={total}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type CountryProps = {
  countryCode: string;
  countryName: string;
  value: number;
} & React.ComponentPropsWithoutRef<"section">;

function Country({ countryCode, countryName, value, className }: CountryProps) {
  return (
    <div
      className={cn(
        "bg-foreground relative flex w-full items-center justify-between rounded px-4 py-2 text-xs",
        className
      )}>
      <div className="flex items-center space-x-4">
        <Image
          width={16}
          height={12}
          src={`/flags/${countryCode.toLowerCase()}.svg`}
          alt={`${countryName} flag`}
        />
        <span>{countryName}</span>
      </div>

      <div className="flex items-center space-x-1">
        <span className="font-medium">{nFormatter(value)}</span>
        <Icon.BarChart2 className="h-3 w-3" />
      </div>
    </div>
  );
}
