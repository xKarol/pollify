import { DEFAULT_ANALYTICS_INTERVAL } from "@pollify/config";
import {
  Icon,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@pollify/ui";
import React from "react";

type AnalyticsIntervalSelectProps = {
  value: string;
  onValueChange?: (value: string) => void;
  hasBasicPlan: boolean;
};

function AnalyticsIntervalSelect({
  value,
  onValueChange,
  hasBasicPlan,
}: AnalyticsIntervalSelectProps) {
  return (
    <Select
      onValueChange={onValueChange}
      defaultValue={value || DEFAULT_ANALYTICS_INTERVAL}>
      <SelectTrigger className="min-w-[180px] max-w-max">
        <div className="flex items-center space-x-2">
          <Icon.Calendar className="h-4 w-4" />
          <SelectValue placeholder="Select a interval" />
        </div>
      </SelectTrigger>
      <SelectContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
        <SelectItem value="1h">Last hour</SelectItem>
        <SelectItem value="24h">Last 24 hours</SelectItem>
        <SelectItem value="7d">Last 7 days</SelectItem>
        <SelectItem value="30d">Last 30 days</SelectItem>
        <Tooltip
          open={hasBasicPlan ? false : undefined}
          disableHoverableContent>
          <TooltipTrigger asChild>
            <SelectItem value="1y" disabled={!hasBasicPlan}>
              Last year
            </SelectItem>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent>
              <p>Basic plan or higher is required to use this option.</p>
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      </SelectContent>
    </Select>
  );
}

export default AnalyticsIntervalSelect;
