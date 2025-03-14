import type { OrderBy, Poll } from "@pollify/types";
import {
  Avatar,
  Icon,
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
import { usePollList } from "../hooks/use-poll-list";
import { BaseLayout } from "../layouts";
import dayjs from "../lib/dayjs";
import { getErrorMessage } from "../utils/get-error-message";
import { getLayout } from "../utils/get-layout";
import { nFormatter } from "../utils/misc";

type SortValue = `${Poll.SortPollFields}.${"desc" | "asc"}`;

export default function Page() {
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
  } = usePollList({ sortBy, orderBy });
  const data = pages?.pages.flatMap(({ data }) => data);

  return (
    <>
      <NextSeo title="Explore polls" />
      <div className="container space-y-8 md:max-w-2xl xl:max-w-4xl">
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
              <Skeleton key={index} className="px-6 py-8">
                <Skeleton className="mb-2 h-4 w-1/4 max-w-full" />
                <Skeleton className="mb-5 h-6 w-3/4 max-w-full" />
                <span className="flex items-center space-x-2">
                  <Skeleton className="size-6 rounded-full" />
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
            <ul className="flex min-h-[40vh] flex-col space-y-3 lg:space-y-4">
              {data?.map((poll) => (
                <Link
                  key={poll.id}
                  href={routes.poll(poll.id)}
                  className="bg-foreground border-border rounded-2xl border px-6 py-8">
                  <div className="text-accent mb-2 flex items-center text-xs">
                    <Avatar
                      className="size-5"
                      src={poll.user?.image || ""}
                      alt={`${poll.user?.name || "guest"}'s profile`}>
                      {poll.user?.name[0]}
                    </Avatar>
                    <span className="ml-2">{poll.user?.name || "guest"}</span>
                    <span className="ml-1.5 text-[#737373]">
                      {dayjs(poll.createdAt).format("DD MMM")}
                    </span>
                  </div>
                  <h1 className="mb-3 truncate text-lg font-medium">
                    {poll.question}
                  </h1>
                  <div className="flex items-center justify-between">
                    <div className="text-accent flex items-center space-x-1">
                      <Icon.Clock size={16} />
                      <span className="text-xs">
                        {dayjs(poll.createdAt).fromNow()}
                      </span>
                    </div>
                    <div className="text-accent flex items-center space-x-1">
                      <Icon.ChartNoAxesColumn size={16} />
                      <span className="text-xs">
                        {nFormatter(poll.totalVotes)} votes
                      </span>
                    </div>
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

Page.getLayout = getLayout(BaseLayout);
