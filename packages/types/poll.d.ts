import type { Poll, Answer, User, Vote } from "@poll/prisma/client";

import type {
  PaginationParams,
  PaginationResponse,
  SortingParams,
} from "./global.d.ts";

export type CreatePollData = {
  userId?: string;
  question: string;
  answers: Pick<Answer, "text">[];
  isPublic?: boolean;
  requireRecaptcha?: boolean;
};

export type DeletePollData = {
  pollId: string;
};

export type GetPollData = {
  pollId: string;
};

export type VotePollData = {
  pollId: string;
  answerId: string;
};

export type GetVoteUsersData = {
  pollId: string;
};

export type SortPollFields = Extract<keyof Poll, "createdAt" | "totalVotes">;

export type UpdatePollData = Partial<
  Pick<Poll, "isPublic" | "requireRecaptcha" | "question">
>;

// Frontend
export interface Api {
  getPoll: (pollId: string) => Promise<ApiResponse["getPoll"]>;
  getPolls: (
    params: PaginationParams & SortingParams<SortPollFields>
  ) => Promise<ApiResponse["getPolls"]>;
  createPoll: (pollData: CreatePollData) => Promise<ApiResponse["createPoll"]>;
  deletePoll: (pollId: string) => Promise<ApiResponse["deletePoll"]>;
  updatePoll: (data: UpdatePollData) => Promise<ApiResponse["updatePoll"]>;
  votePoll: (
    pollId: string,
    answerId: string,
    reCaptchaToken: string
  ) => Promise<ApiResponse["votePoll"]>;
  getPollVoters: (pollId: string) => Promise<ApiResponse["getPollVoters"]>;
  getPollUserAnswerChoice: (
    pollId: string
  ) => Promise<ApiResponse["getPollUserAnswerChoice"]>;
}

// Backend
// @ts-expect-error
export interface Services extends Api {
  getPolls: (
    params: PaginationParams & {
      skip: number;
    } & SortingParams<SortPollFields>
  ) => Promise<ApiResponse["getPolls"]>;
  updatePoll: (
    pollId: string,
    data: UpdatePollData
  ) => Promise<ApiResponse["updatePoll"]>;
  votePoll: (params: {
    userId?: string;
    pollId: string;
    answerId: string;
  }) => Promise<ApiResponse["votePoll"]>;
  getPollUserAnswerChoice: (
    userId: string,
    pollId: string
  ) => Promise<Vote | null>;
}

export type ApiResponse = {
  getPoll: Poll & { answers: Answer[]; user: User | null };
  getPolls: PaginationResponse<
    (Poll & { user: User; userId: string | null })[]
  >;
  createPoll: Poll;
  deletePoll: void;
  updatePoll: Poll;
  votePoll: Vote;
  getPollVoters: User[];
  getPollUserAnswerChoice: Vote | Record<string, unknown>;
};
