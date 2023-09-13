import { Button, Icon } from "@poll/ui";
import { Loader } from "lucide-react";
import { NextSeo } from "next-seo";
import Link from "next/link";

import Header from "../components/header";
import { routes } from "../config/routes";
import { usePolls } from "../hooks/use-polls";
import dayjs from "../lib/dayjs";
import { getErrorMessage } from "../utils/error";

export default function Page() {
  const {
    data: pages,
    isLoading,
    isSuccess,
    isError,
    isFetchingNextPage,
    error,
    hasNextPage,
    fetchNextPage,
  } = usePolls();
  const data = pages?.pages.flatMap(({ data }) => data);
  return (
    <>
      <Header />

      <NextSeo title="Public Polls" />
      <div className="space-y-8 container mt-8 lg:mt-16 md:max-w-2xl xl:max-w-4xl">
        <div className="justify-between items-center flex">
          <h1 className="text-2xl font-medium">Public Polls</h1>
          <Button className="text-neutral-900 bg-neutral-100 hover:bg-neutral-100/50">
            Recent <Icon.ChevronDown />
          </Button>
        </div>
        {/* TODO ADD loading & error UI */}
        {isLoading && <div>Loading...</div>}
        {isError && <div>{getErrorMessage(error)}</div>}
        {isSuccess && (
          <div className="flex flex-col space-y-8">
            <ul className="flex flex-col space-y-8">
              {data?.map((poll) => (
                <Link
                  key={poll.id}
                  href={routes.poll(poll.id)}
                  className="bg-neutral-100 px-3 py-4 rounded-[4px] space-y-4">
                  <h1 className="text-lg">{poll.question}</h1>
                  <div className="flex justify-between items-center text-sm font-normal text-neutral-300">
                    <span>{dayjs(poll.createdAt).fromNow()}</span>
                    <span>{poll.totalVotes} votes</span>
                  </div>
                </Link>
              ))}
            </ul>

            <div className="mx-auto">
              {isFetchingNextPage && <Loader />}
              {hasNextPage && (
                <button onClick={() => fetchNextPage()}>Fetch More</button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
