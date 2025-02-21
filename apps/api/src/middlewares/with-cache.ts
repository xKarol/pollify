import { createMiddleware } from "hono/factory";

import { createQueue, createWorker } from "../lib/queue";
import { redis } from "../lib/redis";
import type { withAuth } from "../middlewares/with-auth";
import type { MiddlewareEnv } from "../types";

type WithCacheOptions = {
  requireUser?: boolean;
};

export function withCache(
  secondsToExpire: number,
  options: WithCacheOptions = {}
) {
  const { requireUser = false } = options;
  return createMiddleware<
    MiddlewareEnv<typeof withAuth> & {
      Variables: {
        cache: {
          set: (data: Record<string, unknown> | unknown[]) => Promise<void>;
          delete: (cacheKey: string) => Promise<void>;
        };
      };
    }
  >(async (c, next) => {
    const { isLoggedIn, session } = c.get("user");
    const userId = session?.id;

    const cacheKey = `${c.req.url}${requireUser ? `:${userId}` : ""}`;

    if (requireUser && !isLoggedIn) {
      return next();
    }

    const cacheData = await redis.get(cacheKey);
    if (cacheData) {
      return c.json(cacheData); // TODO should not be json
    }

    c.set("cache", {
      set: async (data) => {
        await cacheQueue.add(
          cacheKey,
          {
            ex: secondsToExpire,
            data: JSON.stringify(data),
          },
          {
            removeOnComplete: true,
          }
        );
      },
      delete: async () => {
        await redis.del(cacheKey);
      },
    });

    return next();
  });
}

type QueueData = {
  ex: number;
  data: string;
};

const cacheQueue = createQueue<QueueData>("cache-queue");
createWorker<QueueData>(
  "cache-queue",
  async (job) => {
    const { ex, data } = job.data;
    return await redis.setex(job.name, ex, data);
  },
  {
    removeOnFail: {
      age: 1 * 3600, // keep up to 1 hour
    },
  }
);
