import { Hono } from "hono";

import analytics from "./analytics";
import healthCheck from "./health-check";
import me from "./me";
import payments from "./payments";
import polls from "./polls";
import qr from "./qr";
import webhooks from "./webhooks";

const routes = new Hono();

routes.route("/", healthCheck);
routes.route("/", analytics);
routes.route("/", me);
routes.route("/", polls);
routes.route("/", payments);
routes.route("/", qr);
routes.route("/", webhooks);

export default routes;
