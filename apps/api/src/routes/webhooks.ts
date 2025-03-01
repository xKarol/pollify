import { apiUrls } from "@pollify/config";
import type { Context } from "hono";
import { Hono } from "hono/quick";

import { stripe } from "../lib/stripe";
import { getPlanNameFromPriceId, PaymentMetdata } from "../services/payments";
import { updateUserData } from "../services/user";

const webhooks = new Hono().post(
  apiUrls.webhooks.stripe,
  async (c: Context) => {
    const signature = c.req.header("stripe-signature") as string;
    const body = await c.req.raw.clone().json();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    switch (event.type) {
      case "customer.subscription.created": {
        const { userId, priceId } = event.data.object
          .metadata as PaymentMetdata;

        const planName = await getPlanNameFromPriceId(priceId);

        await updateUserData(userId, {
          plan: planName,
        });
        break;
      }

      case "customer.subscription.deleted": {
        const { userId } = event.data.object.metadata as PaymentMetdata;

        await updateUserData(userId, {
          plan: "free",
        });
        break;
      }
    }

    return c.json({ received: true });
  }
);

export default webhooks;
