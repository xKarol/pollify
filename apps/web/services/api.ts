import { createClient } from "@pollify/api/client";
import ky from "ky";

export const client = createClient(process.env.NEXT_PUBLIC_ORIGIN_URL!, {
  fetch(input, requestInit, _Env, _executionCtx) {
    return ky(input, {
      ...requestInit,
      hooks: {
        beforeError: [
          async (error) => {
            const errorBody = (await error.response.json()) as {
              message: string;
              status: number;
            };
            if (errorBody?.message) {
              throw new Error(errorBody.message);
            }
            return error;
          },
        ],
      },
    });
  },
});
