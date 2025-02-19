// import dotenv from "dotenv";
// import path from "path";
// const isProduction = process.env.NODE_ENV === "production";
// const isTest = process.env.NODE_ENV === "test";
// if (isProduction) {
//   dotenv.config();
// } else if (isTest) {
//   dotenv.config({ path: path.join(__dirname, "../../.env.test") });
// } else {
//   dotenv.config({ path: "./.env.dev" });
// }
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().optional().default("development"),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  SENTRY_DSN: z.string().optional(),
});

export const parseEnv = (env: NodeJS.ProcessEnv) => {
  return envSchema.parse(env);
};

export type Env = z.infer<typeof envSchema>;

// declare namespace NodeJS {
//   interface ProcessEnv extends Env {}
// }
