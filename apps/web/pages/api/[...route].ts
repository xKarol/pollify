import { handle } from "@app/api/vercel";
import type { PageConfig } from "next";

export const config: PageConfig = {
  runtime: "edge",
};

export default handle();
