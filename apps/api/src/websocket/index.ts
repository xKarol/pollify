import type { WebSocket } from "@poll/types";
import type http from "http";
import { Server } from "socket.io";

import { corsConfig } from "../config/cors";
import { getPollVotes } from "../services/polls";

async function websocketInit(
  httpServer: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >
) {
  const io: WebSocket.ServerSocket = new Server(httpServer, {
    // cors: corsConfig,
    path: "/ws",
    serveClient: false,
  });

  io.on("connection", (socket) => {
    socket.on("join-poll", (pollId) => {
      socket.join(`poll:${pollId}`);
    });

    socket.on("poll-vote-trigger", async (data) => {
      const { pollId } = data;
      const pollAnswers = await getPollVotes(pollId);
      io.to(`poll:${pollId}`).emit("poll-vote-update", pollAnswers);
    });
  });
}

export default websocketInit;
