import QRCode from "qrcode";

export const generateQRCode = (text: string) => {
  return QRCode.toString(text, {
    type: "svg",
  });
};
