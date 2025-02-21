import { Hono } from "hono";

import analytics from "./analytics";
import healthCheck from "./health-check";
import me from "./me";
import payments from "./payments";
import polls from "./polls";
import qr from "./qr";
import webhooks from "./webhooks";

const routes = new Hono()
  .route("/", healthCheck)
  .route("/", analytics)
  .route("/", me)
  .route("/", polls)
  .route("/", payments)
  .route("/", qr)
  .route("/", webhooks);

export default routes;
