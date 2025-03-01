import { DatabaseError } from "@neondatabase/serverless";
import httpError from "http-errors";
import { ZodError } from "zod";

export const captureError = (error: unknown) => {
  if (error instanceof ZodError)
    return httpError.Forbidden(error.issues[0].message);

  if (error instanceof DatabaseError) {
    return httpError(400, "Unknown database error");
  }

  if (error instanceof httpError.HttpError) {
    return error;
  }

  return httpError.InternalServerError();
};
