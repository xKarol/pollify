import { Tabs, TabsContent, TabsList, TabsTrigger } from "@pollify/ui";
import { Home } from "lucide-react";
import type { InferGetStaticPropsType } from "next";
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
    { icon: <Home />, text: "Create unlimited polls" },
    { icon: <Home />, text: "View basic poll results" },
    { icon: <Home />, text: "Public and private polls" },
    {
      icon: <Home />,
      text: "Up to 6 answers per poll",
    },
  ],
  basic: [
    { icon: <Home />, text: "Basic poll analytics" },
    { icon: <Home />, text: "10 active polls at a time" },
    { icon: <Home />, text: "Results export (CSV)" },
    {
      icon: <Home />,
      text: "Set a voting time limit",
    },
  ],
  pro: [
    { icon: <Home />, text: "Advanced poll analytics" },
    { icon: <Home />, text: "Unlimited active polls" },
    { icon: <Home />, text: "Unlimited poll answers" },
    {
      icon: <Home />,
      text: "Priority support",
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

export default function PricingPage({
  plans,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <NextSeo title="Pricing" />
      <div className="container">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="mx-auto mb-8 flex max-w-3xl flex-col space-y-4">
            <h1 className="text-center text-2xl font-medium xl:text-3xl">
              Pricing
            </h1>
            <p className="text-accent text-center xl:text-lg">
              Find your ideal plan and unleash the full potential of our poll
              platform
            </p>
          </div>
          <Tabs defaultValue="year" className="mt-8 flex flex-col items-center">
            <TabsList>
              <TabsTrigger value="year">Annualy</TabsTrigger>
              <TabsTrigger value="month">Monthly</TabsTrigger>
            </TabsList>
            <div className="flex space-x-8">
              {plans.map((plan) => {
                return plan.prices.map((price) => (
                  <TabsContent
                    key={`${plan.planName}.${price.interval}`}
                    value={price.interval}
                    className="mt-12 w-full md:max-w-[calc((100%/2)-1rem)] xl:max-w-[calc((100%/3)-1rem)]">
                    <PricingCard
                      className="h-full"
                      // @ts-expect-error
                      features={planFeatures[plan.planName.toLowerCase()]}
                      description={plan.description}
                      variant={
                        plan.planName === "Pro" ? "recommended" : "default"
                      }
                      planName={plan.planName}
                      priceId={price.id}
                      currencySymbol={price.currencySymbol}
                      // @ts-expect-error
                      interval={price.interval}
                      price={price.unitAmount / 100}
                    />
                  </TabsContent>
                ));
              })}
            </div>
          </Tabs>
          <PricingTable
            planNames={
              plans.map((plan) => plan.planName) as [string, string, string]
            }
            features={tableFeatures}
          />
        </div>
      </div>
    </>
  );
}

PricingPage.getLayout = getLayout(BaseLayout);
