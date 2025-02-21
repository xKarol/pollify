import type { Vote, Answer, Poll } from "@pollify/prisma/client";
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
} from "@pollify/ui";
import { type FetchNextPageOptions } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React from "react";

import { InfiniteScrollContainer } from "../../../components/infinite-scroll-container";
import { routes } from "../../../config/routes";

type VotesTableProps = {
  data: (Vote & { poll: Poll; answer: Answer })[];
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  fetchNextPage: (options?: FetchNextPageOptions) => Promise<unknown>;
};

export function VotesTable({
  data,
  fetchNextPage,
  isFetchingNextPage = false,
  hasNextPage = false,
}: VotesTableProps) {
  const router = useRouter();

  return (
    <InfiniteScrollContainer
      fetchNextPage={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Answer option</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((vote) => (
            <TableRow key={vote.id} className="border-x">
              <TableCell className="max-w-xs truncate font-medium">
                {vote.poll.question}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {vote.answer.text}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {vote.poll.isPublic ? (
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
                {dayjs(vote.createdAt).format("DD.MM.YYYY h:mm")}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
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
                    <DropdownMenuItem
                      className="space-x-2"
                      onSelect={() => router.push(routes.poll(vote.poll.id))}>
                      <Icon.ExternalLink className="h-4 w-4" />
                      <span>Open link</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </InfiniteScrollContainer>
  );
}
