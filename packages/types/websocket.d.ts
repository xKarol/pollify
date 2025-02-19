import type { Answer } from "@poll/prisma/client";
import type { Server } from "socket.io";
import type { Socket } from "socket.io-client";

export type Events = "POLL_VOTES";

export interface ServerToClientEvents {
  "poll-vote-update": (data: Answer[]) => void;
}

export interface ClientToServerEvents {
  "join-poll": (pollId: string) => void;
  "poll-vote-trigger": (data: { pollId: string }) => void;
}

export interface InterServerEvents {}

export type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
export type ServerSocket = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
