import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@pollify/ui";
import React from "react";

import QRCode from "../../../components/qr-code";
import { routes } from "../../../config/routes";
import { getBaseUrl } from "../../../utils/get-base-url";

type ShareQRDialogProps = {
  pollId: string;
  trigger: React.ReactNode;
} & Omit<React.ComponentProps<typeof Dialog>, "children">;

export function ShareQRDialog({
  pollId,
  trigger,
  ...props
}: ShareQRDialogProps) {
  const shareUrl = `${getBaseUrl()}${routes.poll(pollId)}`;
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
        </DialogHeader>

        <div className="my-16 flex w-full flex-col items-center">
          <QRCode className="size-64" text={shareUrl} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
