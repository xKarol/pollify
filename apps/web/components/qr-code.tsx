import { cn } from "@pollify/lib";
import { Button, Icon } from "@pollify/ui";
import Image from "next/image";
import React from "react";

import { useQRCode } from "../hooks/use-qr-code";

type QRCodeProps = { text: string } & Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children"
>;

export default function QRCode({ text, className, ...props }: QRCodeProps) {
  const { data: qrCodeSrc, isLoading, isError, refetch } = useQRCode(text);

  return (
    <div
      className={cn(
        "flex size-40 items-center justify-center overflow-hidden",
        className
      )}
      {...props}>
      {isLoading && (
        <Icon.Loader2 size={24} className="text-accent animate-spin" />
      )}
      {isError && (
        <div className="flex flex-col items-center space-y-2">
          <Icon.X size={24} className="text-danger" />
          <Button
            onClick={() => refetch()}
            className="text-xs"
            size="sm"
            variant="text">
            Try Again
          </Button>
        </div>
      )}
      <div className="relative size-full">
        {qrCodeSrc ? (
          <Image src={Buffer.from(qrCodeSrc).toString()} alt="qr code" fill />
        ) : null}
      </div>
    </div>
  );
}
