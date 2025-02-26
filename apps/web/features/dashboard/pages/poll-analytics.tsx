import { Icon, toast } from "@pollify/ui";
import { NextSeo } from "next-seo";
import { useQueryState } from "next-usequerystate";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { routes } from "../../../config/routes";
import { useHasPermission } from "../../../hooks/use-has-permission";
import { usePoll } from "../../../hooks/use-poll";
import {
  AnalyticsCard,
  AnalyticsIntervalSelect,
  Header,
  TopCountries,
  TopDevices,
  VotesAreaChart,
} from "../components";
import { AnalyticsProvider } from "../context";
import { useAnalyticsParams } from "../hooks";
import { BaseLayout } from "../layouts";

const PollAnalyticsPage = () => {
  const [, setInterval] = useQueryState("interval");
  const { hasPermission } = useHasPermission();
  const hasBasicPlan = hasPermission("BASIC");
  const analyticsParams = useAnalyticsParams();
  const router = useRouter();
  const pollId = router.query.pollId as string;
  const { data, isSuccess } = usePoll(pollId, {
    retry: false,
  });

  useEffect(() => {
    if (!isSuccess) {
      toast("This poll does not exist.", { variant: "error" });
      router.push(routes.DASHBOARD.HOME);
    }
  }, [router, isSuccess]);

  if (!pollId && !isSuccess) return null;
  return (
    <>
      <NextSeo
        title={isSuccess ? `Analytics - ${data.question}` : `Analytics`}
      />
      <AnalyticsProvider value={{ pollId, ...analyticsParams }}>
        <BaseLayout>
          <Header
            heading="Analytics"
            description={isSuccess ? `Poll: ${data.question}` : ""}
            ActionComponent={
              <AnalyticsIntervalSelect
                hasBasicPlan={hasBasicPlan}
                onValueChange={setInterval}
                value={analyticsParams.interval}
              />
            }
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <AnalyticsCard
              heading="Total Views"
              statsValue={0}
              lastMonthValue={0}
              StatIcon={<Icon.Eye className="h-4 w-4" />}
            />
            <AnalyticsCard
              heading="Total Votes"
              statsValue={0}
              lastMonthValue={0}
              StatIcon={<Icon.CheckCircle className="h-4 w-4" />}
            />
            <AnalyticsCard
              heading="Total Shares"
              statsValue={0}
              lastMonthValue={0}
              StatIcon={<Icon.Share2 className="h-4 w-4" />}
            />
            <VotesAreaChart className="row-span-2 h-[300px] sm:col-span-2 lg:h-[500px]" />
            <div className="flex flex-wrap gap-4 lg:flex-col lg:flex-nowrap lg:gap-0 lg:space-y-8">
              <TopCountries className="min-w-[160px] flex-1" />
              <TopDevices className="min-w-[160px] flex-1" />
            </div>
          </div>
        </BaseLayout>
      </AnalyticsProvider>
    </>
  );
};

export default PollAnalyticsPage;
