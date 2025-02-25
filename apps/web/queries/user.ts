import {
  getUserPollListKey,
  getUserPollListOptions,
} from "../features/dashboard/hooks/use-user-poll-list";
import {
  getUserPollVoteListKey,
  getUserPollVoteListOptions,
} from "../features/dashboard/hooks/use-user-poll-vote-list";

export const userKeys = {
  getUserPollList: getUserPollListKey,
  getUserPollVotes: getUserPollVoteListKey,
};

export const userOptions = {
  getUserPollList: getUserPollListOptions,
  getUserPollVotes: getUserPollVoteListOptions,
} satisfies Record<keyof typeof userKeys, unknown>;
