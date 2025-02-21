import { cn } from "@pollify/lib";
import type { Analytics } from "@pollify/types";
import dayjs from "dayjs";
import React, { useCallback } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  type TooltipProps,
  Area,
} from "recharts";
import type {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

import { nFormatter } from "../../../utils/misc";
import { useAnalyticsContext } from "../context";
import { useAnalyticsVotes } from "../hooks";

type VotesAreaChartProps = Omit<
  React.ComponentProps<typeof ResponsiveContainer>,
  "children"
>;

export default function VotesAreaChart({
  className,
  ...props
}: VotesAreaChartProps) {
  const { interval, groupBy, dateFrom, dateTo, pollId } = useAnalyticsContext();
  const { data } = useAnalyticsVotes({
    interval: interval,
    pollId,
  });

  const generatePlaceholderData = useCallback(() => {
    const ticks = dayjs(dateTo * 1000).diff(dateFrom * 1000, groupBy);
    let date = dayjs(dateTo * 1000)
      .set("millisecond", 0)
      .set("second", 0)
      .set("minutes", 0);

    if (groupBy === "minute") {
      date = date.set("minutes", dayjs(dateTo * 1000).minute());
    }

    const data = Array.from({ length: ticks + 1 }, (_, i) => ({
      total: 0,
      timestamp: date.subtract(i, groupBy).unix(),
    }));
    return data;
  }, [dateFrom, dateTo, groupBy]);

  const placeholderData = generatePlaceholderData();

  const chartData = data?.length
    ? sortData([...placeholderData, ...data])
    : sortData(placeholderData);

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      aspect={16 / 9}
      className={cn(
        "rounded border border-neutral-300 dark:border-neutral-800",
        className
      )}
      {...props}>
      <AreaChart data={chartData} margin={{ left: 8, bottom: 8 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#98FB98" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#98FB98" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3"
          strokeWidth={1}
          vertical={false}
          stroke="#A3A3A3"
          strokeOpacity={0.1}
        />
        <XAxis
          tickMargin={10}
          axisLine={false}
          height={30}
          dataKey="timestamp"
          tickFormatter={(tick) => formatTick(tick, groupBy)}
          type="number"
          scale="time"
          domain={[dateFrom * 1000, dateTo * 1000]}
        />
        <YAxis
          tickMargin={10}
          axisLine={false}
          width={30}
          allowDecimals={false}
          type="number"
          domain={[0, "auto"]}
          tickFormatter={nFormatter}
        />
        <Tooltip content={<CustomTooltip groupBy={groupBy} />} />

        <Area
          dataKey="total"
          type="monotone"
          stroke="#98FB98"
          fill={`url(#colorUv)`}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const formatTemplate = (groupBy: Analytics.GroupBy) => {
  if (groupBy === "month") {
    return "MMMM YYYY";
  } else if (groupBy === "day") {
    return "DD MMM YYYY";
  } else {
    return "DD MMM YYYY HH:mm:ss";
  }
};

function CustomTooltip({
  active,
  payload,
  label,
  groupBy,
}: TooltipProps<ValueType, NameType> & { groupBy: Analytics.GroupBy }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded border border-neutral-200 bg-neutral-100 px-4 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p>
          <strong className="font-medium">Date:</strong>{" "}
          <span>{dayjs(label).format(formatTemplate(groupBy))}</span>
        </p>
        <p>
          <strong className="font-medium">Total:</strong>{" "}
          <span>{nFormatter(+payload[0].value)}</span>
        </p>
      </div>
    );
  }

  return null;
}

function sortData(data: Analytics.VotesData[]) {
  return [
    ...data
      .map((voteData) => ({
        ...voteData,
        timestamp: voteData.timestamp * 1000,
      }))
      .sort((a, b) => a.timestamp - b.timestamp),
  ];
}

function formatTick(tick: number, group: Analytics.GroupBy) {
  if (group === "month") return dayjs(tick).format("MMM");
  if (group === "day") return dayjs(tick).format("DD.MM");
  return dayjs(tick).format("HH:mm");
}
