import type { cors } from "hono/cors";

const whiteList = [
  new URL(process.env.ORIGIN_URL as string).origin,
  new URL(process.env.FRONTEND_URL as string).origin,
];

type CorsOptions = Parameters<typeof cors>[0];

export const corsConfig: CorsOptions = {
  origin: whiteList,
};
