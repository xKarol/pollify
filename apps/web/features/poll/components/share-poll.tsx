import { cn } from "@pollify/lib";
import { Icon, Input, toast } from "@pollify/ui";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { useCopyToClipboard } from "react-use";

import { ShareSocial } from "../../../components/share-social";

type SharePollProps = {
  shareUrl: string;
} & React.ComponentPropsWithoutRef<"div">;

export function SharePoll({ shareUrl, className, ...props }: SharePollProps) {
  const [, copy] = useCopyToClipboard();

  const copyLink = () => {
    copy(shareUrl);
    toast("Copied to clipboard", { variant: "success" });
  };

  return (
    <div
      className={cn(
        "rounded border-[2px] border-neutral-300 dark:border-neutral-800",
        className
      )}
      {...props}>
      <div className="flex items-center space-x-2 border-b-[2px] border-neutral-300 p-4 dark:border-neutral-800">
        <Icon.LucideShare2 className="h-4 w-4" />
        <h1 className="text-base font-medium">Share</h1>
      </div>
      <div className="flex flex-col items-center justify-center p-4 py-6">
        <div className="flex flex-col space-y-2">
          <p className="text-sm">Share link</p>
          <div className="flex">
            <Input
              className="peer w-full max-w-[450px] rounded-r-none border-r-0"
              value={shareUrl}
              readOnly
              RightIcon={
                <div
                  className="group flex h-full w-16 cursor-pointer items-center justify-center rounded-r-[4px] bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  onClick={copyLink}>
                  <Icon.Copy className="h-4 w-4 transition-transform ease-out group-active:scale-75" />
                </div>
              }
            />
          </div>
        </div>
        <div className="my-4 flex flex-wrap gap-4">
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
    </div>
  );
}
