import { Button, Icon } from "@pollify/ui";
import dynamic from "next/dynamic";
import React from "react";

import { getErrorMessage } from "../../../utils/get-error-message";
import { Header } from "../components";
import PollsTable from "../components/polls-table";
import { useUserPolls } from "../hooks";
import { BaseLayout } from "../layouts";

const DynamicCreatePollDialog = dynamic(() =>
  import("../components/create-poll-dialog").then((mod) => mod.CreatePollDialog)
);

const MyPollsPage = () => {
  const {
    data: pages,
    isLoading,
    isFetchingNextPage,
    isSuccess,
    error,
    hasNextPage,
    fetchNextPage,
  } = useUserPolls();
  const data = pages?.pages.flatMap(({ data }) => data);

  return (
    <BaseLayout>
      <Header
        heading="Your polls"
        ActionComponent={
          <DynamicCreatePollDialog>
            <Button size="sm">
              <Icon.Plus />
              <span>Create a poll</span>
            </Button>
          </DynamicCreatePollDialog>
        }
      />
      <div className="flex flex-col">
        {error && <div>{getErrorMessage(error)}</div>}
        {isLoading && <Icon.Loader2 className="m-auto animate-spin" />}
        {isSuccess && (
          <PollsTable
            data={data}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
          />
        )}
      </div>
    </BaseLayout>
  );
};

export default MyPollsPage;
