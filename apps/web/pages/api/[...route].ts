import { handle } from "hono/vercel";
import type { PageConfig } from "next";

import app from "../../../api/src/index";

export const config: PageConfig = {
  runtime: "edge",
};

export default handle(app);
