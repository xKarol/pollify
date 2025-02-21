import type { Payment } from "@poll/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@poll/ui";
import { NextSeo } from "next-seo";
import React from "react";

import { PricingCard, PricingTable } from "../features/pricing/components";
import { BaseLayout } from "../layouts";
import { client } from "../services/api";
import { getLayout } from "../utils/get-layout";

const tableFeatures: [string, boolean, boolean, boolean][] = [
  ["Basic poll creation", true, true, true],
  ["Poll Management Dashboard", true, true, true],
  ["No Ads", false, true, true],
  ["Create Unlimited Polls", false, true, true],
  ["Poll Editing", false, true, true],
  ["Email Notifications", false, true, true],
  ["Custom Poll Link", false, false, true],
  ["Advanced Analytics", false, false, true],
  ["Priority Customer Support", false, false, true],
  ["API Access", false, false, true],
];

const planFeatures = {
  free: [
    { text: "feature 1" },
    { text: "feature 2" },
    { text: "feature 3" },
    {
      text: "feature 4",
    },
  ],
  basic: [
    { text: "feature 1" },
    { text: "feature 2" },
    { text: "feature 3" },
    {
      text: "feature 4",
    },
  ],
  pro: [
    { text: "feature 1" },
    { text: "feature 2" },
    { text: "feature 3" },
    {
      text: "feature 4",
    },
  ],
} as const;

export async function getStaticProps() {
  const response = await client.api.payments.plans.$get();
  const plans = await response.json();

  return {
    props: {
      plans: [
        {
          planName: "Free",
          description: "Get started with our basic features at no cost!",
          prices: plans[0].prices.map((price) => ({ ...price, unitAmount: 0 })),
        },
        ...plans,
      ],
    },
  };
}

export default function PricingPage({ plans }: { plans: Payment.Plan[] }) {
  return (
    <>
      <NextSeo title="Pricing" />
      <div className="container">
        <div className="mx-auto my-4 flex max-w-4xl flex-col items-center space-y-8 md:my-8 xl:my-16">
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-2xl font-semibold">Pricing</h1>
            <p className="text-center text-lg text-neutral-400">
              Find your ideal plan and unleash the full potential of our poll
              platform
            </p>
          </div>
          <Tabs
            defaultValue="month"
            className="mt-8 flex flex-col items-center">
            <TabsList>
              <TabsTrigger value="month">Monthly</TabsTrigger>
              <TabsTrigger value="year">Yearly</TabsTrigger>
            </TabsList>
            <div className="flex space-x-8">
              {plans.map((plan) => {
                return plan.prices.map((price) => (
                  <TabsContent
                    key={`${plan.planName}.${price.interval}`}
                    value={price.interval}
                    className="mt-12">
                    <PricingCard
                      // TODO fix features
                      // features={planFeatures[plan.planName.toLowerCase()]}
                      features={[]}
                      description={plan.description}
                      variant={
                        plan.planName === "Pro" ? "recommended" : "default"
                      }
                      planName={plan.planName}
                      priceId={price.id}
                      currencySymbol={price.currencySymbol}
                      interval={price.interval}
                      price={price.unitAmount / 100}
                    />
                  </TabsContent>
                ));
              })}
            </div>
          </Tabs>
          <PricingTable
            planNames={plans.map((plan) => plan.planName)}
            features={tableFeatures}
          />
        </div>
      </div>
    </>
  );
}

PricingPage.getLayout = getLayout(BaseLayout);
