import { apiUrls } from "@poll/config";
import type { Plan } from "@poll/prisma/client";
import { prisma } from "@poll/prisma/edge";
import { Hono, type Context } from "hono";

import { productIds } from "../constants";
import { stripe } from "../lib/stripe";

const webhooks = new Hono();

const planNames: readonly Plan[] = ["BASIC", "PRO"] as const;

webhooks.post(apiUrls.webhooks.stripe, async (c: Context) => {
  const signature = c.req.header("stripe-signature") as string;
  const body = await c.req.raw.clone().json();
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  switch (event.type) {
    case "customer.subscription.created": {
      const { userId, productId } = event.data.object.metadata as {
        userId: string;
        priceId: string;
        productId: string;
      };

      const planIndex = productIds.findIndex(
        (findProductId) => findProductId === productId
      );

      if (planIndex === -1) throw new Error("Invalid plan productId.");

      await prisma.user.update({
        where: { id: userId },
        data: { plan: planNames[planIndex] },
      });
      break;
    }
    case "customer.subscription.deleted": {
      const { userId } = event.data.object.metadata as {
        userId: string;
        planName: Plan;
      };

      await prisma.user.update({
        where: { id: userId },
        data: { plan: "FREE" },
      });
      break;
    }
  }

  return c.json({ received: true });
});

export default webhooks;
