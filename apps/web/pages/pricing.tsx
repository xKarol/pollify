import { cn } from "@poll/lib";
import type { Plan } from "@poll/prisma/client";
import type { Payment } from "@poll/types";
import {
  Alert,
  AlertTitle,
  Button,
  Icon,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
} from "@poll/ui";
import { QueryClient, dehydrate, useMutation } from "@tanstack/react-query";
import type { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React from "react";

import { routes } from "../config/routes";
import { useHasPermission } from "../hooks/use-has-permission";
import { usePricingPlans } from "../hooks/use-pricing-plans";
import { BaseLayout } from "../layouts";
import { paymentOptions } from "../queries/payment";
import { createPlanCheckoutSession } from "../services/api";
import { getBaseUrl } from "../utils/get-base-url";
import { getLayout } from "../utils/get-layout";

const features: string[][] = [
  ["Basic poll creation", "Limited analytics", "Ad-Supported"],
  ["Enhanced poll creation", "Basic analytics", "No Ads"],
  ["Custom poll links", "Advanced analytics", "Priority Support"],
];

const plansData: {
  name: Plan;
  description: string;
}[] = [
  {
    name: "BASIC",
    description: "For users seeking more options and capabilities.",
  },
  {
    name: "PRO",
    description: "Go pro for advanced features and maximum impact",
  },
];

const featuresTable: [string, boolean, boolean, boolean][] = [
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

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const queryClient = new QueryClient();
    await queryClient.fetchQuery(paymentOptions.getPricingPlans());
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch {
    return {
      props: {},
    };
  }
};

const paymentCycles: Payment.PaymentCycle[] = ["month", "year"];

export default function PricingPage() {
  const { status } = useSession();
  const router = useRouter();
  const { hasPermission } = useHasPermission();
  const { isLoading, isError, data: pricingPlans } = usePricingPlans();
  const { mutateAsync } = useMutation({
    mutationFn: ({
      priceId,
      productId,
    }: {
      priceId: string;
      productId: string;
    }) => {
      return createPlanCheckoutSession(priceId, productId);
    },
  });

  const handlePayment = async (priceId: string, productId: string) => {
    try {
      if (status == "unauthenticated") {
        return void redirectUnauthenticatedToLoginPage();
      }
      if (status === "authenticated") {
        const url = await mutateAsync({ priceId, productId });
        await router.push(url);
      }
    } catch (e) {
      console.log(e);
      toast("Something went wrong...", { variant: "error" });
    }
  };

  const redirectUnauthenticatedToLoginPage = () => {
    if (status == "unauthenticated") {
      router.push(routes.LOGIN, {
        query: {
          redirect: `${getBaseUrl()}${routes.PRICING}`,
        },
      });
    }
  };

  return (
    <>
      <NextSeo title="Pricing" />
      <div className="container">
        <div className="mx-auto my-4 flex max-w-4xl flex-col items-center space-y-8 md:my-8 xl:my-16">
          {isError ? (
            <Alert variant="error">
              <AlertTitle>Something went wrong...</AlertTitle>
            </Alert>
          ) : null}
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-2xl font-semibold">Pricing</h1>
            <p className="text-center text-lg text-neutral-400">
              Find your ideal plan and unleash the full potential of our poll
              platform
            </p>
          </div>

          <Tabs defaultValue="month" className="flex flex-col items-center">
            <TabsList className="mb-4 flex w-full max-w-[300px] rounded-full sm:max-w-[400px]">
              {paymentCycles.map((cycle) => (
                <TabsTrigger
                  key={cycle}
                  value={cycle}
                  className="flex-1 rounded-full capitalize">
                  {cycle + "ly"}
                </TabsTrigger>
              ))}
            </TabsList>

            {paymentCycles.map((cycle) => (
              <TabsContent
                key={cycle}
                value={cycle}
                className="mt-0 flex flex-wrap gap-4">
                <PricingCard
                  className="h-full w-full md:max-w-[calc((100%/2)-16px)] xl:max-w-[calc((100%/3)-16px)]"
                  planName="Free"
                  description="Ideal for simple polls and initial experimentation."
                  price={0}
                  planType={cycle}
                  features={features[0]}
                  ActionComponent={
                    <Button
                      type="button"
                      disabled={
                        isLoading && status === "unauthenticated"
                          ? false
                          : hasPermission("FREE")
                      }
                      onClick={redirectUnauthenticatedToLoginPage}
                      className="rounded-full capitalize">
                      Create account
                    </Button>
                  }
                />
                {plansData.map(({ name, description }, index) => {
                  const selectedCyclePrice =
                    pricingPlans === undefined
                      ? undefined
                      : pricingPlans[index].prices?.find(
                          (price) => price.interval === cycle
                        );
                  return (
                    <PricingCard
                      key={name}
                      className="h-full w-full md:max-w-[calc((100%/2)-16px)] xl:max-w-[calc((100%/3)-16px)]"
                      planName={name}
                      description={description}
                      price={
                        selectedCyclePrice
                          ? selectedCyclePrice.amount / 100
                          : undefined
                      }
                      planType={cycle}
                      features={features[index + 1]}
                      ActionComponent={
                        <Button
                          type="button"
                          disabled={
                            isLoading && status === "unauthenticated"
                              ? false
                              : hasPermission(name)
                          }
                          onClick={async () =>
                            handlePayment(
                              selectedCyclePrice.id,
                              pricingPlans[index].productId
                            )
                          }
                          className="rounded-full capitalize">
                          Get {name.toLowerCase()}
                        </Button>
                      }
                    />
                  );
                })}
              </TabsContent>
            ))}
          </Tabs>
          <Table className="mt-16 min-w-max">
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead className="text-center">Free</TableHead>
                <TableHead className="text-center">Basic</TableHead>
                <TableHead className="text-center">Pro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {featuresTable.map(([description, ...isAvailable]) => (
                <TableRow key={description}>
                  <TableCell
                    className="max-w-xs truncate capitalize"
                    title={description}>
                    {description}
                  </TableCell>
                  {isAvailable.map((planAvailable, index) => (
                    <TableCell key={description + index}>
                      {planAvailable ? (
                        <Icon.Check className="mx-auto text-green-500" />
                      ) : (
                        <Icon.X className="mx-auto text-neutral-500" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}

PricingPage.getLayout = getLayout(BaseLayout);

type PricingCardProps = {
  planName: string;
  price: number | undefined;
  description: string;
  features: string[];
  planType: Payment.PaymentCycle;
  ActionComponent: JSX.Element;
} & React.ComponentPropsWithoutRef<"div">;

function PricingCard({
  planName,
  price,
  description,
  features,
  planType,
  ActionComponent,
  className,
  ...props
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "dark:bg-dark flex min-w-[240px] flex-col justify-between rounded-[8px] border-2 border-neutral-100 bg-white px-4 py-8 dark:border-neutral-800",
        className
      )}
      {...props}>
      <div className="mb-6 space-y-4">
        <div>
          <h2 className="mb-4 text-xl font-medium capitalize">
            {planName.toLowerCase()}
          </h2>
          {price === undefined ? (
            <Skeleton className="mb-2 h-6 w-20" />
          ) : (
            <p className="mb-2 text-xl font-medium">
              ${price}{" "}
              <span className="text-base text-neutral-400">
                per {planType === "month" ? "month" : "year"}
              </span>
            </p>
          )}
          <p className="mb-2 text-base font-medium text-neutral-500">
            {description}
          </p>
        </div>
        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center space-x-4 text-sm">
              <Icon.CheckIcon className="text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      {ActionComponent}
    </div>
  );
}
