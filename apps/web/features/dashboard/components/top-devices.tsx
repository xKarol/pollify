import type { Analytics } from "@pollify/types";
import { Icon, Skeleton } from "@pollify/ui";
import React from "react";

import { useAnalyticsContext } from "../context";
import { useAnalyticsDevices } from "../hooks";
import AnalyticsBox from "./analytics-box";
import AnalyticsProgress from "./analytics-progress";

type TopDevicesProps = React.ComponentPropsWithoutRef<"div">;

const deviceIcon: Record<Analytics.Devices, JSX.Element> = {
  mobile: <Icon.Smartphone size={16} />,
  tablet: <Icon.Tablet size={16} />,
  desktop: <Icon.Monitor size={16} />,
};

export default function TopDevices({ ...props }: TopDevicesProps) {
  const { interval, pollId } = useAnalyticsContext();
  const { data, isSuccess, isError, isLoading } = useAnalyticsDevices({
    pollId,
    interval: interval,
  });
  const isEmpty = isSuccess && data.data.length === 0;

  return (
    <AnalyticsBox
      name="Top devices"
      isError={isError}
      isLoading={isLoading}
      isEmpty={isEmpty}
      SkeletonComponents={
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
      }
      {...props}>
      <div className="flex flex-col space-y-1">
        {data?.data.map(({ device_name, amount, date }) => (
          <AnalyticsProgress
            key={date}
            text={device_name}
            leftIcon={deviceIcon[device_name as Analytics.Devices]}
            max={data.metrics.max}
            value={amount}
            total={data.total}
          />
        ))}
      </div>
    </AnalyticsBox>
  );
}
