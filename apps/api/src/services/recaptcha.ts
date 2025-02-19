import axios from "axios";

export const verifyReCaptcha = async (token: string) => {
  const { data } = await axios.post<{
    success: boolean;
    "error-codes": string[];
  }>("https://www.google.com/recaptcha/api/siteverify", null, {
    params: {
      secret: process.env.RECAPTCHA_SECRET_TOKEN,
      response: token,
    },
  });

  return data;
};
