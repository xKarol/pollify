import type { Poll, Answer, User, Vote } from "@poll/prisma";
import type { Stripe } from "stripe";

export type CreatePollData = {
  userId?: string;
  question: string;
  answers: Pick<Answer, "text">[];
  isPublic?: boolean;
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

export type PaginationResult<T = unknown> = {
  data: T;
  nextPage: number | undefined;
};

// Frontend
export interface Api {
  getPoll: (
    pollId: string
  ) => Promise<Poll & { answers: Answer[]; user: User | null }>;
  getPolls: (
    page?: number,
    limit?: number
  ) => Promise<PaginationResult<(Poll & { totalVotes: number })[]>>;
  getUserPolls: (
    page?: number,
    limit?: number
  ) => Promise<PaginationResult<(Poll & { totalVotes: number })[]>>;
  createPoll: (pollData: CreatePollData) => Promise<Poll>;
  deletePoll: (pollId: string) => Promise<void>;
  votePoll: (pollId: string, answerId: string) => Promise<Vote>;
  getPollVoters: (pollId: string) => Promise<User[]>;
  getPollUserAnswerChoice: (pollId: string) => Promise<Vote | null>;
  // payments
  getPricingPlans: () => Promise<
    (Omit<Stripe.Product, "default_price"> & { default_price: Stripe.Price })[]
  >;
  createPaymentPageUrl: (productId: string) => Promise<string>;
}

// Backend
export interface Services extends Api {
  getPolls: (params: {
    page?: number;
    skip: number;
    limit?: number;
  }) => Promise<PaginationResult<(Poll & { totalVotes: number })[]>>;
  getUserPolls: (
    userId: string,
    params: {
      page?: number;
      skip: number;
      limit?: number;
    }
  ) => Promise<PaginationResult<(Poll & { totalVotes: number })[]>>;
  votePoll: (params: {
    userId?: string;
    pollId: string;
    answerId: string;
  }) => Promise<Vote>;
  getPollUserAnswerChoice: (
    userId: string,
    pollId: string
  ) => Promise<Vote | null>;
}
