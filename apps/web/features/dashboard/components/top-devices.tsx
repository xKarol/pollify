import { cn } from "@pollify/lib";
import type { Analytics } from "@pollify/types";
import { Icon, Skeleton } from "@pollify/ui";
import React from "react";

import { nFormatter } from "../../../utils/misc";
import { useAnalyticsContext } from "../context";
import { useAnalyticsTopDevices } from "../hooks";

type TopDevicesProps = React.ComponentPropsWithoutRef<"div">;

const deviceIcon: Record<Analytics.Devices, JSX.Element> = {
  mobile: <Icon.Smartphone className="h-4 w-4" />,
  tablet: <Icon.Tablet className="h-4 w-4" />,
  desktop: <Icon.Monitor className="h-4 w-4" />,
};

export default function TopDevices({ className, ...props }: TopDevicesProps) {
  const { interval, pollId } = useAnalyticsContext();
  const { data, isSuccess, isError, isLoading } = useAnalyticsTopDevices({
    pollId,
    interval: interval,
  });

  return (
    <div className={cn("flex flex-col space-y-2", className)} {...props}>
      <h1 className="text-sm font-medium">Top devices</h1>
      {isError && (
        <div className="flex">
          <span className="text-accent mx-auto my-10 text-xs">
            Something went wrong...
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
          {Object.entries(data).map(([deviceName, total]) => (
            <div
              key={deviceName}
              className="bg-foreground relative flex w-full items-center justify-between rounded px-4 py-2 text-xs">
              <div className="flex items-center space-x-4">
                {deviceIcon[deviceName]}
                <span className="capitalize">{deviceName}</span>
              </div>

              <div className="flex items-center space-x-1">
                <span className="font-medium">{nFormatter(total)}</span>
                <Icon.BarChart2 className="size-3" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
