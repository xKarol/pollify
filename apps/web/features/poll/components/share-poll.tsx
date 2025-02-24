import { cn } from "@pollify/lib";
import { Icon, Input, toast } from "@pollify/ui";
import { useRouter } from "next/router";
import {
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
} from "react-share";
import { useCopyToClipboard } from "react-use";

import { ShareSocial } from "../../../components/share-social";
import { getBaseUrl } from "../../../utils/get-base-url";
import { ShareQRDialog } from "./share-qr-dialog";

type SharePollProps = {
  pollId: string;
} & React.ComponentPropsWithoutRef<"div">;

export function SharePoll({ pollId, className, ...props }: SharePollProps) {
  const router = useRouter();
  const shareUrl = `${getBaseUrl()}${router.asPath}`;
  const [, copy] = useCopyToClipboard();

  const copyLink = () => {
    copy(shareUrl);
    toast("Copied to clipboard", { variant: "success" });
  };

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <h1 className="mb-6 text-lg font-medium">Share</h1>

      <div className="grid grid-cols-4 place-items-center gap-5 *:flex md:grid-cols-8">
        <ShareQRDialog
          pollId={pollId}
          trigger={
            <Share name="QR" url={shareUrl}>
              <Icon.QrCode />
            </Share>
          }
        />

        <Share name="Facebook" as={FacebookShareButton} url={shareUrl}>
          <Icon.Facebook />
        </Share>
        <Share name="X" as={TwitterShareButton} url={shareUrl}>
          <Icon.XTwitter />
        </Share>
        <Share name="Reddit" as={RedditShareButton} url={shareUrl}>
          <Icon.Reddit />
        </Share>
        <Share name="LinkedIn" as={LinkedinShareButton} url={shareUrl}>
          <Icon.Linkedin />
        </Share>
        <Share name="Youtube" as={LinkedinShareButton} url={shareUrl}>
          <Icon.Youtube />
        </Share>
        <Share name="Instagram" as={LinkedinShareButton} url={shareUrl}>
          <Icon.Instagram />
        </Share>
        <Share name="Telegram" as={TelegramShareButton} url={shareUrl}>
          <Icon.Telegram />
        </Share>
      </div>

      <div className="mt-8 flex w-full *:w-full">
        <Input
          className="peer w-full rounded-r-none border-r-0"
          value={shareUrl}
          readOnly
          RightIcon={
            <div
              className="group flex h-full cursor-pointer items-center justify-center rounded-r-xl bg-neutral-200 px-8 text-black dark:bg-neutral-800 dark:text-white"
              onClick={copyLink}>
              <span className="transition-transform ease-out group-active:scale-90">
                Copy
              </span>
            </div>
          }
        />
      </div>
    </div>
  );
}

type ShareProps = { name: string } & React.ComponentProps<typeof ShareSocial>;

function Share({ name, children, ...rest }: ShareProps) {
  return (
    <ShareSocial {...rest}>
      <div className="text-accent flex flex-col space-y-1 ">
        <div className="hover:text-accent/50 flex size-16 items-center justify-center rounded-full bg-neutral-200 transition-colors dark:bg-neutral-800">
          {children}
        </div>
        <span className="text-xs">{name}</span>
      </div>
    </ShareSocial>
  );
}
