import { parseEnv } from "./config/env";

import { sentry } from "@hono/sentry";
import { rateLimiter } from "hono-rate-limiter";
// import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { Hono } from "hono/quick";
import { secureHeaders } from "hono/secure-headers";

import { corsConfig } from "./config/cors";
import { errorHandler } from "./middlewares/error-handler";
import routes from "./routes";
import { getIP } from "./utils/get-ip";

parseEnv(process.env);

const app = new Hono()
  .use(
    "*",
    sentry({
      dsn: process.env.SENTRY_DSN,
    })
  )
  .use(cors(corsConfig))
  .use(secureHeaders())
  .use(logger())
  .use(
    rateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
      standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
      keyGenerator: (c) => getIP(c.req)!, // Method to generate custom identifiers for clients.
    })
  )
  .route("/api", routes)
  .onError(errorHandler);
// app.use("/favicon.ico", serveStatic({ path: "static/favicon.ico" }));

// app.use((req, res, next) => {
//   if (req.originalUrl.includes("/webhooks")) {
//     next();
//   } else {
//     express.json()(req, res, next);
//   }
// });

export default app;
export type AppType = typeof app;
