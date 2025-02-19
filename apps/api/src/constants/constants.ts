export const productIds = [
  process.env.STRIPE_BASIC_PLAN_PRODUCT_ID as string,
  process.env.STRIPE_PRO_PLAN_PRODUCT_ID as string,
] as const;
