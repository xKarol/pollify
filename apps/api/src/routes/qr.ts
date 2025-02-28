import { apiUrls } from "@pollify/config";
import { Hono } from "hono/quick";
import { z } from "zod";

import { zValidator } from "../middlewares/validator";
import { generateQRCode } from "../services/qr";

const qr = new Hono().get(
  apiUrls.qr.getQRCode,
  zValidator("query", z.object({ text: z.string().nonempty() })),
  async (c) => {
    const { text } = c.req.valid("query");
    const svg = await generateQRCode(decodeURIComponent(text));

    c.header("Content-Type", "image/svg+xml");
    return c.body(svg);
  }
);

export default qr;
