import { hc, type ClientRequestOptions } from "hono/client";

import type { AppType } from ".";

export const createClient = <T extends AppType>(
  baseUrl: string,
  options?: ClientRequestOptions
) => {
  return hc<T>(baseUrl, options);
};
