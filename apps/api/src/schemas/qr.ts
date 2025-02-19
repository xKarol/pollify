import type { QR } from "@poll/types";
import { z } from "zod";

export const getQRCode: z.Schema<{ query: QR.GetQRParams }> = z.object({
  query: z.object({
    text: z.string().nonempty(),
  }),
});
export type GetQRCode = z.infer<typeof getQRCode>;
