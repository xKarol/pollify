import {
  Avatar,
  Icon,
  LoadingButton,
  Badge,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Button,
  AvatarGroup,
} from "@pollify/ui";
import type { InferResponseType } from "hono";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
// eslint-disable-next-line import/no-named-as-default
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";

import { usePollUserSelection } from "../../../hooks/use-poll-user-selection";
import { useSubmitVote } from "../../../hooks/use-submit-vote";
import dayjs from "../../../lib/dayjs";
import type { client } from "../../../services/api";
import { getErrorMessage } from "../../../utils/get-error-message";
import { nFormatter } from "../../../utils/misc";
import { usePollLiveResults } from "../hooks";
import { ManagePollDropdown } from "./manage-poll-dropdown";
import { PollOptions } from "./poll-options";
import { PollResults } from "./poll-results";
import { SharePoll } from "./share-poll";

export const Poll = ({
  data,
  voters,
}: {
  data: InferResponseType<(typeof client.api.polls)[":pollId"]["$get"]>;
  voters: InferResponseType<
    (typeof client.api.polls)[":pollId"]["voters"]["$get"]
  >;
}) => {
  const router = useRouter();
  const pollId = router.query.pollId as string;
  const { data: session } = useSession();
  const pollUserSelection = usePollUserSelection(pollId);
  const [selectedOptionId, setSelectedOptionId] = useState<string>();
  const recaptchaRef = useRef<ReCAPTCHA>();

  const { mutateAsync: submitVote, isPending: isVoteLoading } = useSubmitVote({
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
  usePollLiveResults(pollId);

  const isVoted = pollUserSelection !== undefined;
  const isOwner = session?.user?.id === data.userId;
  const authorName = data?.user?.name || "guest";

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!selectedOptionId) return;

    const token = await recaptchaRef?.current?.executeAsync();

    await submitVote({
      param: {
        pollId,
        answerId: selectedOptionId,
      },
      json: {
        reCaptchaToken: token || undefined,
      },
    });
  };

  return (
    <>
      {/* @ts-expect-error TODO fix */}
      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        hidden={!data.requireRecaptcha || isVoted}
      />
      <NextSeo title={data.question} />
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex justify-between space-x-2">
          <div className="w-full space-y-2">
            <h1 className="mb-2 text-2xl font-medium lg:text-3xl">
              {data.question}
            </h1>
            <div className="flex flex-wrap items-center space-x-2">
              <Avatar
                src={data.user?.image}
                className="border-border size-6 border">
                {data.user?.name[0]}
              </Avatar>
              <span className="text-accent text-sm">
                by a {authorName} · {dayjs(data.createdAt).fromNow()}
              </span>
              {!data.isPublic ? (
                <Badge variant="secondary">
                  <Icon.Lock />
                  <span>Private</span>
                </Badge>
              ) : null}
              {isVoted ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="relative flex size-2">
                      <span className="bg-primary absolute inline-flex size-full animate-ping rounded-full opacity-75"></span>
                      <span className="bg-primary relative inline-flex size-2 rounded-full"></span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Real-time data is updated every 5 seconds</p>
                  </TooltipContent>
                </Tooltip>
              ) : null}
            </div>
          </div>
          {isOwner ? (
            <ManagePollDropdown
              pollId={pollId}
              trigger={
                <Button variant="text" className="p-4">
                  <Icon.MoreHorizontal size={24} className="!size-6 shrink-0" />
                </Button>
              }
            />
          ) : null}
        </div>
        <div className="my-10">
          {isVoted ? (
            <PollResults
              selectedOptionId={pollUserSelection}
              totalVotes={data.totalVotes}
              options={data.answers}
            />
          ) : (
            <PollOptions
              selectedOptionId={selectedOptionId}
              onSelectOption={setSelectedOptionId}
              options={data.answers}
            />
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {voters?.length >= 2 ? (
              <AvatarGroup max={4}>
                {voters.map((voter) => (
                  <Avatar
                    key={voter.id}
                    alt={`${voter.name} voter`}
                    src={voter.image}
                    className="border-border size-8 border">
                    {voter.name[0]}
                  </Avatar>
                ))}
              </AvatarGroup>
            ) : null}
            <p className="text-accent text-sm font-normal">
              {nFormatter(data.totalVotes)} votes
            </p>
          </div>

          <LoadingButton
            className="min-w-[100px] rounded-full"
            type="submit"
            disabled={isVoted}
            isLoading={isVoteLoading}>
            Vote{isVoted ? "d" : ""}
          </LoadingButton>
        </div>
      </form>
      <SharePoll pollId={pollId} className="mt-8 lg:mt-16" />
    </>
  );
};
