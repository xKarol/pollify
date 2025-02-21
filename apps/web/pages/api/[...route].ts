import { handle } from "@pollify/api/vercel";
import type { PageConfig } from "next";

export const config: PageConfig = {
  runtime: "edge",
};

export default handle();
