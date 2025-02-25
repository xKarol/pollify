import { createClient } from "@pollify/api/client";
import ky from "ky";

export const client = createClient(process.env.NEXT_PUBLIC_ORIGIN_URL!, {
  fetch(input, requestInit, _Env, _executionCtx) {
    return ky(input, requestInit);
  },
});
