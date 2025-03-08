import { useQueryState } from "next-usequerystate";
import React from "react";

import { useHasPermission } from "../../../hooks/use-has-permission";
import {
  AnalyticsExportDialog,
  AnalyticsIntervalSelect,
  Header,
  TopCountries,
  TopDevices,
  VotesChart,
  TopBrowsers,
  WorldMap,
} from "../components";
import { AnalyticsProvider } from "../context";
import { useAnalyticsParams } from "../hooks";
import { BaseLayout } from "../layouts";

const AnalyticsPage = ({ pollId }: { pollId?: string }) => {
  const [, setInterval] = useQueryState("interval");
  const { hasPermission } = useHasPermission();
  const hasBasicPlan = hasPermission("basic");
  const analyticsParams = useAnalyticsParams();

  return (
    <AnalyticsProvider value={{ pollId, ...analyticsParams }}>
      <BaseLayout>
        <Header
          heading="Analytics"
          description={pollId !== undefined ? `Poll ID: ${pollId}` : undefined}
          ActionComponent={
            <>
              <AnalyticsExportDialog />
              <AnalyticsIntervalSelect
                hasBasicPlan={hasBasicPlan}
                onValueChange={setInterval}
                value={analyticsParams.interval}
              />
            </>
          }
        />
        <div className="grid w-full grid-cols-12 gap-6">
          <VotesChart className="col-span-12 aspect-video" />
          <TopDevices className="col-span-12 h-64 lg:col-span-6" />
          <TopBrowsers className="col-span-12 h-64 lg:col-span-6" />
          <TopCountries className="col-span-12 h-64 xl:col-span-5" />
          <WorldMap className="col-span-12 aspect-video xl:col-span-7" />
        </div>
      </BaseLayout>
    </AnalyticsProvider>
  );
};

export default AnalyticsPage;
