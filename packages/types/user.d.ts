import type { Answer, User, Vote, Poll } from "@pollify/prisma/client";

import type {
  PaginationParams,
  PaginationResponse,
  SortingParams,
} from "./global.d.ts";

export type UpdateUserData = Partial<
  Pick<User, "email" | "name" | "timeZone" | "clockType">
>;

export type GetUserVotesResponse = (Vote & {
  poll: Poll;
  answer: Answer;
})[];

export type SortVotesFields = Extract<keyof Vote, "createdAt">;
export type SortPollsFields = Extract<
  keyof Poll,
  "createdAt" | "totalVotes" | "isPublic"
>;

// Frontend
export interface Api {
  updateUser: (data: UpdateUserData) => Promise<ApiResponse["updateUser"]>;
  deleteUser: () => Promise<ApiResponse["deleteUser"]>;
  getUserPolls: (
    params: PaginationParams & SortingParams<SortPollsFields>
  ) => Promise<ApiResponse["getUserPolls"]>;
  getUserVotes: (
    params: PaginationParams & SortingParams<SortVotesFields>
  ) => Promise<ApiResponse["getUserVotes"]>;
}

// Backend
export interface Services {
  updateUser: (
    userId: string,
    data: UpdateUserData
  ) => Promise<ApiResponse["updateUser"]>;
  deleteUser: (userId: string) => Promise<ApiResponse["deleteUser"]>;
  getUserPolls: (
    params: PaginationParams & {
      userId: string;
      skip: number;
    } & SortingParams<SortPollsFields>
  ) => Promise<ApiResponse["getUserPolls"]>;
  getUserVotes: (
    params: PaginationParams & {
      userId: string;
      skip: number;
    } & SortingParams<SortVotesFields>
  ) => Promise<ApiResponse["getUserVotes"]>;
}

export type ApiResponse = {
  updateUser: User;
  deleteUser: undefined;
  getUserPolls: PaginationResponse<Poll[]>;
  getUserVotes: PaginationResponse<GetUserVotesResponse>;
};
