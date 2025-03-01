import type { Plans } from "@pollify/db/types";
import type { Stripe } from "stripe";

export type PaymentCycle = Extract<
  Stripe.Price.Recurring.Interval,
  "month" | "year"
>;

export type PlanData = {
  productId: string;
  name: Plans;
  prices: {
    id: string;
    interval: Stripe.Price.Recurring.Interval;
    amount: number;
    currency: string;
  }[];
};

// Frontend
export interface Api {
  getPricingPlans: () => Promise<ApiResponse["getPricingPlans"]>;
  createPlanCheckoutSession: (
    priceId: string,
    productId: string
  ) => Promise<ApiResponse["createPlanCheckoutSession"]>;
}

// Backend
export interface Services extends Api {}

export type ApiResponse = {
  getPricingPlans: PlanData[];
  createPlanCheckoutSession: string;
};
