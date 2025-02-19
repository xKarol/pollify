import { zValidator } from "@hono/zod-validator";
import { apiUrls } from "@poll/config";
import type { Payment } from "@poll/types";
import { Hono } from "hono";
import httpError from "http-errors";
import type Stripe from "stripe";
import { z } from "zod";

import type { App } from "..";
import { productIds } from "../constants";
import { stripe } from "../lib/stripe";
import { requireAuth } from "../middlewares/require-auth";
import { withAuth } from "../middlewares/with-auth";
import { withCache } from "../middlewares/with-cache";

const payments: App = new Hono();

payments.get(
  apiUrls.payment.getPricingPlans,
  // withCache(60 * 60 * 24), //1 day
  async (c) => {
    const [basicPlanProductId, proPlanProductId] = productIds;

    const [basicPlanPrices, proPlanPrices] = await Promise.all([
      stripe.prices.list({
        product: basicPlanProductId,
      }),
      stripe.prices.list({
        product: proPlanProductId,
      }),
    ]);

    const filterPrices = (
      prices: Stripe.Response<Stripe.ApiList<Stripe.Price>>
    ) => {
      const filteredData = prices.data.filter(
        (price) => price.type === "recurring"
      );
      if (filteredData.length !== 2)
        throw new Error(
          `Invalid recurring prices length. Expected 2, Received: ${filteredData.length}`
        );
      return [...filteredData];
    };

    const data: Payment.PlanData[] = [
      {
        productId: basicPlanProductId,
        name: "BASIC",
        // @ts-ignore
        prices: filterPrices(basicPlanPrices).map((price) => {
          return {
            id: price.id,
            interval: price.recurring?.interval,
            amount: price.unit_amount,
            currency: price.currency,
          };
        }),
      },
      {
        productId: proPlanProductId,
        name: "PRO",
        // @ts-ignore
        prices: filterPrices(proPlanPrices).map((price) => ({
          id: price.id,
          interval: price.recurring?.interval,
          amount: price.unit_amount,
          currency: price.currency,
        })),
      },
    ];

    // await c.var.cache.set(data);

    return c.json(data);
  }
);

payments.post(
  apiUrls.payment.createPlanCheckoutSession,
  withAuth,
  requireAuth,
  zValidator(
    "json",
    z.object({
      priceId: z.string().nonempty(),
      productId: z.string().nonempty(),
    })
  ),
  async (c) => {
    const { priceId, productId } = c.req.valid("json");
    const { session: user } = c.get("user");
    const redirectUrl = process.env.FRONTEND_URL!;

    const payment = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      subscription_data: {
        metadata: {
          userId: user.id,
          productId,
          priceId,
        },
        trial_period_days: 14,
      },
      success_url: redirectUrl,
      cancel_url: `${redirectUrl}/pricing`,
    });

    if (!payment.url) throw httpError(400, "Something went wrong...");

    return c.json(payment.url);
  }
);

export default payments;
