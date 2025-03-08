import type { Analytics } from "@pollify/types";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@pollify/ui";
import { scaleTime } from "@visx/scale";
import dayjs from "dayjs";
import numeral from "numeral";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { nFormatter } from "../../../utils/misc";
import { useAnalyticsContext } from "../context";
import { useAnalyticsVotes } from "../hooks";
import AnalyticsBox from "./analytics-box";

const chartConfig = {
  votes: {
    label: "Votes",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

function formatTick(tick: string, group: Analytics.GroupBy) {
  if (group === "month") return dayjs(tick).format("MMM");
  if (group === "day") return dayjs(tick).format("D MMM");
  return dayjs(tick).format("HH:mm");
}

export function VotesChart({ ...props }) {
  const { interval, groupBy, dateFrom, dateTo, pollId } = useAnalyticsContext();
  const { data, isLoading, isError } = useAnalyticsVotes({
    interval: interval,
    pollId,
  });
  const timeScale = scaleTime({
    domain: [dayjs(dateFrom * 1000).toDate(), dayjs(dateTo * 1000).toDate()],
  });
  const ticksAmount = dayjs(dateTo * 1000).diff(dateFrom * 1000, groupBy);
  const defaultDate = timeScale.ticks(ticksAmount);
  const placeholder = defaultDate.map((date) => ({
    date: date.toISOString(),
    amount: 0,
  }));

  const chartData = concatChartData([
    ...placeholder,
    ...(data?.data ? data.data : []),
  ]);

  return (
    <AnalyticsBox
      name="Votes"
      isEmpty={false}
      isError={isError}
      isLoading={isLoading}
      withScroll={false}
      {...props}>
      <ChartContainer config={chartConfig}>
        <AreaChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            minTickGap={40}
            tickMargin={8}
            tickFormatter={(value) => formatTick(value, groupBy)}
          />
          <YAxis
            dataKey="amount"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={50}
            allowDecimals={false}
            tickFormatter={nFormatter}
          />
          <ChartTooltip
            labelFormatter={(v) => {
              return dayjs(v).format(formatTemplate(groupBy));
            }}
            formatter={(value) => (
              <>
                <div className="h-3 w-1 rounded bg-[--color-votes]"></div>
                {numeral(value).format()} votes
              </>
            )}
            cursor={false}
            content={<ChartTooltipContent />}
          />
          <defs>
            <linearGradient id="fillVotes" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-votes)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-votes)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="amount"
            type="linear"
            fill="url(#fillVotes)"
            fillOpacity={0.4}
            stroke="var(--color-votes)"
          />
        </AreaChart>
      </ChartContainer>
    </AnalyticsBox>
  );
}

function formatTemplate(groupBy: Analytics.GroupBy) {
  if (groupBy === "month") {
    return "MMMM YYYY";
  } else if (groupBy === "day") {
    return "DD MMM YYYY";
  } else {
    return "DD MMM YYYY HH:mm:ss";
  }
}

function concatChartData(data: Analytics.VotesData[]) {
  data.forEach((item) => (item.date = new Date(item.date).toISOString()));
  // @ts-ignore
  data.sort((a, b) => new Date(a.date) - new Date(b.date));

  const uniqueData = [];
  const seenDates = new Set();

  for (let i = data.length - 1; i >= 0; i--) {
    const unix = dayjs(data[i].date).unix();
    if (!seenDates.has(unix)) {
      seenDates.add(unix);
      uniqueData.unshift(data[i]);
    }
  }
  return uniqueData;
}
