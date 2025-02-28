export const verifyReCaptcha = async (token: string) => {
  const url = new URL("https://www.google.com/recaptcha/api/siteverify");
  url.searchParams.set("secret", process.env.RECAPTCHA_SECRET_TOKEN!);
  url.searchParams.set("response", token);

  const response = await fetch(url.toString(), {
    method: "POST",
  });

  if (!response.ok) throw new Error("reCAPTCHA verification failed");
  return response.json() as Promise<{
    success: boolean;
    "error-codes": string[];
  }>;
};
