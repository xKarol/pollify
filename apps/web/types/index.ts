import type {
  InfiniteData,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";

export type HookInfiniteQueryOptions<T> = Omit<
  UseInfiniteQueryOptions<
    InferResponseType<T>,
    Error,
    InfiniteData<InferResponseType<T>>
  >,
  "queryFn" | "queryKey" | "getNextPageParam" | "initialPageParam"
>;

export type HookQueryOptions<T> = Omit<
  UseQueryOptions<InferResponseType<T>>,
  "queryFn" | "queryKey"
>;

export type HookMutationOptions<T> = Omit<
  UseMutationOptions<InferResponseType<T>, Error, InferRequestType<T>>,
  "mutationFn"
>;
