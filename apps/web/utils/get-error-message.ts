import { HTTPError } from "ky";

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (error instanceof HTTPError) return error.response.statusText;

  console.error("Unknown error:", error);
  return "Internal Server Error";
};
