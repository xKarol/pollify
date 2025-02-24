import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { pollKeys } from "../../../queries/poll";

export const usePollLiveResults = (pollId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!pollId) return;
    const eventSource = new EventSource(`/api/polls/${pollId}/live`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      queryClient.setQueryData(pollKeys.getPoll(pollId), () => {
        return {
          ...data,
        };
      });
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [pollId, queryClient]);
};
