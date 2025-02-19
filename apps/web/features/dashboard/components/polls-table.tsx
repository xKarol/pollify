import { cn } from "@poll/lib";
import type { Poll } from "@poll/prisma/client";
import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  toast,
} from "@poll/ui";
import { type FetchNextPageOptions } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCopyToClipboard } from "react-use";

import DeletePollDialog from "../../../components/delete-poll-dialog";
import { InfiniteScrollContainer } from "../../../components/infinite-scroll-container";
import { routes } from "../../../config/routes";
import { getBaseUrl } from "../../../utils/get-base-url";
import { nFormatter } from "../../../utils/misc";
import SharePollDialog from "./share-poll-dialog";

type Props = {
  data: (Poll & { totalVotes: number })[];
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  fetchNextPage: (options?: FetchNextPageOptions) => Promise<unknown>;
};

function PollsTable({
  data,
  fetchNextPage,
  isFetchingNextPage = false,
  hasNextPage = false,
}: Props) {
  return (
    <>
      <InfiniteScrollContainer
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Votes</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((poll) => (
              <PollItemRow
                key={poll.id}
                id={poll.id}
                question={poll.question}
                isPublic={poll.isPublic}
                createdAt={poll.createdAt}
                totalVotes={poll.totalVotes}
              />
            ))}
          </TableBody>
        </Table>
      </InfiniteScrollContainer>
    </>
  );
}

export default PollsTable;

type PollItemRowProps = (Pick<
  Poll,
  "id" | "question" | "isPublic" | "createdAt"
> & {
  totalVotes: number;
}) &
  Omit<React.ComponentPropsWithoutRef<"tr">, "children">;

function PollItemRow({
  id,
  question,
  isPublic,
  createdAt,
  className,
  totalVotes,
  ...props
}: PollItemRowProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [, copy] = useCopyToClipboard();

  useEffect(() => {
    if (isCopied) {
      toast("Copied to clipboard.", { variant: "success" });
    }
    const timeout = setTimeout(() => {
      if (isCopied) setIsCopied(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [isCopied]);

  const handleCopy = (e: Event) => {
    e.preventDefault();
    setIsCopied(true);
    copy(`${getBaseUrl()}${routes.poll(id)}`);
  };

  return (
    <>
      <TableRow key={id} className={cn("border-x", className)} {...props}>
        <TableCell className="max-w-xs truncate font-medium">
          {question}
        </TableCell>
        <TableCell>{nFormatter(totalVotes)}</TableCell>
        <TableCell>
          <Badge variant="secondary">
            {isPublic ? (
              <>
                <Icon.Globe />
                <span>Public</span>
              </>
            ) : (
              <>
                <Icon.Lock />
                <span>Private</span>
              </>
            )}
          </Badge>
        </TableCell>
        <TableCell className="truncate text-right">
          {dayjs(createdAt).format("DD.MM.YYYY h:mm")}
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu
            onOpenChange={(open) => {
              if (open && isCopied) {
                setIsCopied(false);
              }
            }}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="ml-auto rounded p-1 transition-colors hover:bg-neutral-200 hover:dark:bg-neutral-800">
                <Icon.MoreHorizontal className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onCloseAutoFocus={(e) => e.preventDefault()}>
              <DropdownMenuItem className="space-x-2" asChild>
                <Link href={routes.poll(id)}>
                  <Icon.ExternalLink className="h-4 w-4" />
                  <span>Open link</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="space-x-2" onSelect={handleCopy}>
                {isCopied ? (
                  <Icon.Check className="h-4 w-4" />
                ) : (
                  <Icon.Copy className="h-4 w-4" />
                )}
                <span>Copy link</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="space-x-2" asChild>
                <Link href={routes.DASHBOARD.ANALYTICS.poll(id)}>
                  <Icon.BarChart2 className="h-4 w-4" />
                  <span>Analytics</span>
                </Link>
              </DropdownMenuItem>
              <SharePollDialog pollId={id}>
                <DropdownMenuItem
                  className="space-x-2"
                  onSelect={(e) => e.preventDefault()}>
                  <Icon.Share2 className="h-4 w-4" />
                  <span>Share</span>
                </DropdownMenuItem>
              </SharePollDialog>
              <DeletePollDialog pollId={id}>
                <DropdownMenuItem
                  className="space-x-2 text-red-400"
                  onSelect={(e) => e.preventDefault()}>
                  <Icon.Trash2 className="h-4 w-4" />
                  <span>Delete poll</span>
                </DropdownMenuItem>
              </DeletePollDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    </>
  );
}
