import {
  Avatar,
  Icon,
  LoadingButton,
  toast,
  Badge,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  AvatarGroup,
} from "@pollify/ui";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
// eslint-disable-next-line import/no-named-as-default
import ReCAPTCHA from "react-google-recaptcha";

import DeletePollDialog from "../../components/delete-poll-dialog";
import { routes } from "../../config/routes";
import { useGetPoll } from "../../hooks/use-get-poll";
import { useGetPollVoters } from "../../hooks/use-get-poll-voters";
import { usePollAnswerUserChoice } from "../../hooks/use-poll-answer-user-choice";
import { useVotePoll } from "../../hooks/use-vote-poll";
import dayjs from "../../lib/dayjs";
import { getBaseUrl } from "../../utils/get-base-url";
import { nFormatter } from "../../utils/misc";
import { PollAnswerOptions, SharePoll, SkeletonLoading } from "./components";
import { useLiveAnswers } from "./hooks";

const PollPage = () => {
  const router = useRouter();
  const pollId = router.query.pollId as string;
  const { isLoading, isFetching, isSuccess, isError, data, refetch } =
    useGetPoll(pollId);
  const { data: voters } = useGetPollVoters(pollId);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string>();
  const { mutateAsync, isLoading: isVoteLoading } = useVotePoll();
  const userChoiceAnswerId = usePollAnswerUserChoice(pollId);
  const { data: session } = useSession();
  const recaptchaRef = useRef<ReCAPTCHA>();
  const shareUrl = `${getBaseUrl()}${router.asPath}`;
  useLiveAnswers(pollId);

  const isVoted = !!userChoiceAnswerId;

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      if (!selectedAnswerId) return;
      const token = await recaptchaRef.current.executeAsync();
      await mutateAsync({
        pollId,
        answerId: selectedAnswerId,
        reCaptchaToken: token,
      });
    } catch (error) {
      toast("Something went wrong...", { variant: "error" });
      console.log(error);
    }
  };

  const onChange = (value: string) => {
    if (!data?.answers) return;
    const [answer] = data.answers.filter((answer) => answer.id === value);
    setSelectedAnswerId(answer.id);
  };

  if (isError)
    return (
      <div className="container flex h-96 max-w-4xl flex-col items-center space-y-4">
        <h1 className="text-center">Something went wrong...</h1>
        <LoadingButton isLoading={isFetching} onClick={() => refetch()}>
          Try again
        </LoadingButton>
      </div>
    );
  return (
    <div className="container flex max-w-4xl flex-col">
      {isLoading && <SkeletonLoading />}
      {isSuccess && (
        <>
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
                    by a {data.user?.name || "guest"} ·{" "}
                    {dayjs(data.createdAt).fromNow()}
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
                        <span className="relative flex size-2.5">
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-300 opacity-75"></span>
                          <span className="relative inline-flex size-2.5 rounded-full bg-green-400"></span>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Real-time data is updated every 5 seconds</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : null}
                </div>
              </div>
              {session?.user.id === data.userId ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="text" className="p-4">
                      <Icon.MoreHorizontal className="!h-6 !w-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="space-x-2" asChild>
                      <Link href={routes.DASHBOARD.ANALYTICS.poll(pollId)}>
                        <Icon.BarChart2 className="size-4" />
                        <span>Analytics</span>
                      </Link>
                    </DropdownMenuItem>
                    <DeletePollDialog
                      pollId={pollId}
                      onDelete={() => {
                        if (router.asPath === routes.poll(pollId)) {
                          router.replace(routes.HOME);
                        }
                      }}>
                      <DropdownMenuItem
                        className="space-x-2 text-red-400"
                        onSelect={(e) => e.preventDefault()}>
                        <Icon.Trash2 className="size-4" />
                        <span>Delete poll</span>
                      </DropdownMenuItem>
                    </DeletePollDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>
            <PollAnswerOptions
              onValueChange={onChange}
              selectedOptionId={userChoiceAnswerId}
              options={data?.answers ?? []}
            />
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
              {!isVoted ? (
                <LoadingButton
                  className="min-w-[100px] rounded-full"
                  type="submit"
                  isLoading={isVoteLoading}>
                  Vote
                </LoadingButton>
              ) : null}
            </div>
          </form>
          <SharePoll className="mt-8 lg:mt-16" shareUrl={shareUrl} />
        </>
      )}
    </div>
  );
};

export default PollPage;
