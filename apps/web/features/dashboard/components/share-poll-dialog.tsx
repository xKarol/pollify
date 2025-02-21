import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Icon,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Separator,
  toast,
} from "@pollify/ui";
import React, { useRef, useState } from "react";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

import QRCode from "../../../components/qr-code";
import { ShareSocial } from "../../../components/share-social";
import { routes } from "../../../config/routes";
import { useQRCode } from "../../../hooks/use-qr-code";
import { getBaseUrl } from "../../../utils/get-base-url";

type DeletePollDialogProps = {
  pollId: string;
} & React.ComponentProps<typeof Dialog>;

export default function SharePollDialog({
  pollId,
  children,
  ...props
}: DeletePollDialogProps) {
  const shareUrl = `${getBaseUrl()}${routes.poll(pollId)}`;
  const { data: qrCodeSrc } = useQRCode(shareUrl);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  const downloadQRCode = (type: string) => {
    const downloadEl = downloadLinkRef.current;
    if (!downloadEl) return;
    downloadEl.href = qrCodeSrc;
    downloadEl.download = `qr.${type}`;
    downloadEl.click();
  };

  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        overlayClass="bg-none backdrop-blur-none">
        <DialogHeader>
          <DialogTitle>Share poll</DialogTitle>
        </DialogHeader>

        <div className="mb-4 mt-8 flex w-full flex-col items-center">
          <QRCode
            className="rounded border-2 border-neutral-200 dark:border-neutral-800"
            text={shareUrl}
          />
          <div className="mt-4 flex space-x-4">
            <CopyQRCodeButton value={qrCodeSrc} disabled={!qrCodeSrc} />

            <Select onValueChange={downloadQRCode} disabled={!qrCodeSrc}>
              <SelectTrigger>
                <Icon.Download className="h-4 w-4" />
                <span>Download</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpeg">JPEG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator className="my-12" />
          <div className="flex flex-wrap gap-4">
            <ShareSocial as={EmailShareButton} url={shareUrl}>
              <Icon.LucideMail />
            </ShareSocial>
            <ShareSocial as={FacebookShareButton} url={shareUrl}>
              <Icon.Facebook />
            </ShareSocial>
            <ShareSocial as={LinkedinShareButton} url={shareUrl}>
              <Icon.Linkedin />
            </ShareSocial>
            <ShareSocial as={RedditShareButton} url={shareUrl}>
              <Icon.Reddit />
            </ShareSocial>
            <ShareSocial as={TelegramShareButton} url={shareUrl}>
              <Icon.Telegram />
            </ShareSocial>
            <ShareSocial as={TwitterShareButton} url={shareUrl}>
              <Icon.XTwitter />
            </ShareSocial>
            <ShareSocial as={WhatsappShareButton} url={shareUrl}>
              <Icon.Whatsapp />
            </ShareSocial>
          </div>
        </div>
        <a ref={downloadLinkRef} hidden />
      </DialogContent>
    </Dialog>
  );
}

type CopyQRCodeButtonProps = {
  value: string;
} & React.ComponentProps<typeof Button>;

function CopyQRCodeButton({ value, ...props }: CopyQRCodeButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyQRCode = async () => {
    const blob = b64toBlob(value.split(",")[1], "image/png");

    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob,
      }),
    ]);
    setIsCopied(true);
    toast("Copied QR Code to clipboard.", { variant: "success" });
    setTimeout(() => setIsCopied(false), 3000);
  };
  return (
    <Button {...props} variant="outline" onClick={copyQRCode}>
      {isCopied ? <Icon.Check /> : <Icon.Clipboard />}
      <span>Copy</span>
    </Button>
  );
}

function b64toBlob(b64Data: string, contentType = "", sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}
