import { apiUrls } from "@pollify/config";
import { Hono } from "hono/quick";
import httpError from "http-errors";
import { z } from "zod";

import { requireAuth } from "../middlewares/require-auth";
import { zValidator } from "../middlewares/validator";
import { withAuth } from "../middlewares/with-auth";
import { withCache } from "../middlewares/with-cache";
import {
  createCheckoutSession,
  getSubscriptionPlans,
} from "../services/payments";

const payments = new Hono()
  .get(
    apiUrls.payments.getPricingPlans,
    withCache(60 * 60 * 24), //1 day
    async (c) => {
      const plans = await getSubscriptionPlans();
      return c.json(plans);
    }
  )
  .post(
    apiUrls.payments.checkoutSession,
    withAuth,
    requireAuth,
    zValidator(
      "json",
      z.object({
        priceId: z.string().nonempty(),
      })
    ),
    async (c) => {
      const { priceId } = c.req.valid("json");
      const { session: user } = c.get("user");
      const redirectUrl = process.env.FRONTEND_URL!;

      const checkout = await createCheckoutSession({
        priceId,
        redirectUrl,
        metadata: {
          userId: user.id,
          priceId,
        },
      });

      if (!checkout.url) throw httpError(400, "Something went wrong...");

      return c.json({ url: checkout.url });
    }
  );

export default payments;
