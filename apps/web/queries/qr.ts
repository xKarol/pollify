import { getQRCodeKey, getQRCodeOptions } from "../hooks/use-qr-code";

export const qrCodeKeys = {
  getQRCode: getQRCodeKey,
};

export const qrCodeOptions = {
  getQRCode: getQRCodeOptions,
} satisfies Record<keyof typeof qrCodeKeys, unknown>;
