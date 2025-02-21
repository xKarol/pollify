import type { OrderBy, Poll } from "@pollify/types";
import {
  Avatar,
  LoadingButton,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@pollify/ui";
import { NextSeo } from "next-seo";
import { useQueryState } from "next-usequerystate";
import Link from "next/link";

import { InfiniteScrollContainer } from "../components/infinite-scroll-container";
import { routes } from "../config/routes";
import { usePolls } from "../hooks/use-polls";
import { BaseLayout } from "../layouts";
import dayjs from "../lib/dayjs";
import { getErrorMessage } from "../utils/get-error-message";
import { getLayout } from "../utils/get-layout";
import { nFormatter } from "../utils/misc";

type SortValue = `${Poll.SortPollFields}.${"desc" | "asc"}`;

export default function PublicPage() {
  const [sortValue, setSortValue] = useQueryState("sort", {
    defaultValue: "createdAt.desc",
  });

  const [sortBy, orderBy] = sortValue.split(".") as [
    Poll.SortPollFields,
    OrderBy,
  ];
  const {
    data: pages,
    isLoading,
    isSuccess,
    isError,
    isFetchingNextPage,
    isFetching,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = usePolls({ sortBy, orderBy });
  const data = pages?.pages.flatMap(({ data }) => data);

  return (
    <>
      <NextSeo title="Public Polls" />
      <div className="container mt-8 space-y-8 md:max-w-2xl lg:mt-16 xl:max-w-4xl">
        {!isError ? (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-medium">Public Polls</h1>
              <Select onValueChange={(value: SortValue) => setSortValue(value)}>
                <SelectTrigger className="min-w-[120px] max-w-max">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent
                  align="end"
                  onCloseAutoFocus={(e) => e.preventDefault()}>
                  <SelectGroup>
                    <SelectLabel>Sort by</SelectLabel>
                    <SelectSeparator />
                    <SelectItem value="createdAt.desc">
                      Date - Descending
                    </SelectItem>
                    <SelectItem value="createdAt.asc">
                      Date - Ascending
                    </SelectItem>
                    <SelectItem value="totalVotes.desc">
                      Votes - Descending
                    </SelectItem>
                    <SelectItem value="totalVotes.asc">
                      Votes - Ascending
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </>
        ) : null}
        {isLoading && (
          <div className="flex flex-col space-y-8">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="space-y-5 px-3 py-4">
                <Skeleton className="h-6 w-3/4 max-w-full" />
                <span className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-40 max-w-full" />
                </span>
              </Skeleton>
            ))}
          </div>
        )}
        {isError && (
          <div className="flex flex-col items-center space-y-4 py-40">
            <h1>{getErrorMessage(error)}</h1>
            <LoadingButton isLoading={isFetching} onClick={() => refetch()}>
              Try Again
            </LoadingButton>
          </div>
        )}
        {isSuccess && (
          <InfiniteScrollContainer
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}>
            <ul className="flex min-h-[40vh] flex-col space-y-8">
              {data?.map((poll) => (
                <Link
                  key={poll.id}
                  href={routes.poll(poll.id)}
                  className="dark:bg-dark space-y-4 rounded border border-neutral-100 bg-white px-6 py-8  dark:border-neutral-800">
                  <h1 className="text-lg">{poll.question}</h1>
                  <div className="flex items-center justify-between text-sm font-normal text-neutral-400">
                    <div className="flex items-center space-x-2">
                      <Avatar
                        className="h-6 w-6"
                        src={poll.user?.image}
                        alt={`${poll.user?.name || "guest"}'s profile`}>
                        {poll.user?.name[0]}
                      </Avatar>
                      <span>
                        by {poll.user?.name || "guest"} ·{" "}
                        {dayjs(poll.createdAt).fromNow()}
                      </span>
                    </div>
                    <span>{nFormatter(poll.totalVotes)} votes</span>
                  </div>
                </Link>
              ))}
            </ul>
          </InfiniteScrollContainer>
        )}
      </div>
    </>
  );
}

PublicPage.getLayout = getLayout(BaseLayout);
