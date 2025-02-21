import getSymbolFromCurrency from "currency-symbol-map";
import type Stripe from "stripe";

import { stripe } from "../lib/stripe";

type TransformedPlan = {
  planName: string;
  description: string;
  prices: {
    id: string;
    unitAmount: number;
    interval: Stripe.Price.Recurring.Interval;
    currency: string;
    currencySymbol: string;
  }[];
};

export const getSubscriptionPlans = async () => {
  const { data } = await stripe.prices.list({
    active: true,
    expand: ["data.product"],
  });
  // @ts-expect-error fix
  const activePlans = data.filter((price) => price.product.active === true);

  const subscriptionPlans = activePlans.map((price) => {
    return {
      priceId: price.id,
      // @ts-expect-error TODO fix
      planName: price.product.name,
      // @ts-expect-error fix
      description: price.product.description as string,
      currency: price.currency,
      currencySymbol: getSymbolFromCurrency(price.currency) as string,
      unitAmount: price.unit_amount!,
      interval: price.recurring?.interval!,
      // intervalCount: price.recurring?.interval_count,
    };
  });

  const transformedPlans = subscriptionPlans.reduce<TransformedPlan[]>(
    (acc, price) => {
      const existingPlan = acc.find((plan) => plan.planName === price.planName);
      const priceData = {
        id: price.priceId,
        unitAmount: price.unitAmount,
        interval: price.interval,
        currency: price.currency,
        currencySymbol: price.currencySymbol,
      };

      if (existingPlan) {
        existingPlan.prices.push(priceData);
      } else {
        acc.push({
          planName: price.planName,
          description: price.description,
          prices: [priceData],
        });
      }

      return acc;
    },
    []
  );
  return transformedPlans;
};

export type PaymentMetdata = { userId: string; priceId: string };

export const createCheckoutSession = async (params: {
  priceId: string;
  quantity?: number;
  metadata: PaymentMetdata;
  redirectUrl: string;
}) => {
  const { priceId, quantity = 1, metadata, redirectUrl } = params;
  const response = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity }],
    mode: "subscription",
    subscription_data: {
      metadata: metadata,
      //   trial_period_days: 14,
    },
    success_url: redirectUrl,
    cancel_url: `${redirectUrl}/pricing`,
  });
  return response;
};

export const getPlanNameFromPriceId = async (priceId: string) => {
  const price = await stripe.prices.retrieve(priceId);
  const productId = price.product as string;
  const product = await stripe.products.retrieve(productId);
  return product.name;
};
