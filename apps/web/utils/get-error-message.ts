import { HTTPError } from "ky";

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof HTTPError) return error.response.statusText;
  if (error instanceof Error) return error.message;

  console.error("Unknown error:", error);
  return "Internal Server Error";
};
