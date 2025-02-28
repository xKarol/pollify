import type { ErrorHandler } from "hono";

import { captureError } from "../utils/capture-error";

export const errorHandler: ErrorHandler = (err, c) => {
  c.get("sentry").captureException(err);
  const capturedError = captureError(err);
  const status = capturedError.statusCode;

  return c.json(
    {
      status,
      message: capturedError.message,
      ...(process.env.NODE_ENV !== "production" && {
        stack: capturedError.stack,
      }),
    },
    // @ts-expect-error
    status
  );
};
