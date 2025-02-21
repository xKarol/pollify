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
  const {
    data: qrCodeSrc,
    isLoading,
    isError,
    refetch: refetchQRCode,
  } = useQRCode(text);

  return (
    <div
      className={cn(
        "flex h-40 w-40 items-center justify-center overflow-hidden",
        className
      )}
      {...props}>
      {isLoading && (
        <Icon.Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
      )}
      {isError && (
        <div className="flex flex-col items-center space-y-2">
          <Icon.X className="h-6 w-6 text-red-500" />
          <Button
            onClick={() => refetchQRCode()}
            className="text-xs"
            size="sm"
            variant="text">
            Try Again
          </Button>
        </div>
      )}
      {qrCodeSrc ? (
        <Image
          width={160}
          height={160}
          src={Buffer.from(qrCodeSrc).toString()}
          alt="poll share qr code"
        />
      ) : null}
    </div>
  );
}
