import { LoadingButton } from "@pollify/ui";
import { useQueries } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React from "react";

import { pollOptions } from "../../queries/poll";
import { SkeletonLoading } from "./components";
import { Poll } from "./components/poll";

const PollPage = () => {
  const router = useRouter();
  const pollId = router.query.pollId as string;

  const response = useQueries({
    queries: [
      pollOptions.getPoll(pollId, { retry: false }),
      pollOptions.getPollVoters(pollId, { retry: false }),
    ],
    combine(result) {
      const [poll, voters] = result;
      return {
        ...poll,
        voters,
      };
    },
  });
  // usePollLiveResults(pollId);

  if (response.isError)
    return (
      <div className="container flex h-96 max-w-4xl flex-col items-center space-y-4">
        <h1 className="text-center">Something went wrong...</h1>
        <LoadingButton
          isLoading={response.isFetching}
          onClick={() => response.refetch()}>
          Try again
        </LoadingButton>
      </div>
    );
  return (
    <div className="container flex max-w-4xl flex-col">
      {response.isLoading && <SkeletonLoading />}
      {response.isSuccess && (
        <Poll data={response.data} voters={response.voters} />
      )}
    </div>
  );
};

export default PollPage;
