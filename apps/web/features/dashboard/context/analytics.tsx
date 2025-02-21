import type { Analytics } from "@pollify/types";
import { createContext, useContext } from "react";

type AnalyticsContextType = {
  pollId: string | undefined;
  dateFrom: number;
  dateTo: number;
  groupBy: Analytics.GroupBy;
  interval: Analytics.Interval;
};

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export type AnalyticsProviderProps = React.ComponentProps<
  typeof AnalyticsContext.Provider
>;

export default function AnalyticsProvider({
  children,
  ...props
}: AnalyticsProviderProps) {
  return (
    <AnalyticsContext.Provider {...props}>{children}</AnalyticsContext.Provider>
  );
}

export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext);

  if (!context) {
    throw new Error(
      "useAnalyticsContext should be used within <AnalyticsProvider>"
    );
  }

  return context;
};
