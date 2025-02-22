import { createMiddleware } from "hono/factory";

import { redis } from "../lib/redis";
import type { withAuth } from "../middlewares/with-auth";
import type { MiddlewareEnv } from "../types";

const isCacheEnabled = process.env.NODE_ENV === "production";

type WithCacheOptions = {
  disable?: boolean;
  requireUser?: boolean;
};

export function withCache(secondsToExpire: number, options?: WithCacheOptions) {
  const { disable = !isCacheEnabled, requireUser = false } = options || {};

  return createMiddleware<
    MiddlewareEnv<typeof withAuth> & {
      Variables: {
        cache: {
          set: (data: Record<string, unknown> | unknown[]) => Promise<void>;
          delete: () => Promise<void>;
        };
      };
    }
  >(async (c, next) => {
    if (disable) {
      return next();
    }

    const { isLoggedIn, session } = c.get("user") || {};
    const userId = session?.id;

    const cacheKey = `${c.req.url}${requireUser ? `:${userId}` : ""}`;

    if (requireUser && !isLoggedIn) {
      return next();
    }

    const cacheData = await redis.get(cacheKey);
    if (cacheData) {
      return c.json(cacheData);
    }

    c.set("cache", {
      set: async (data) => {
        await redis.set(cacheKey, data, { ex: secondsToExpire });
      },
      delete: async () => {
        await redis.del(cacheKey);
      },
    });

    const originalJson = c.json.bind(c);

    // @ts-ignore
    c.json = async (...args: Parameters<typeof originalJson>) => {
      const [data] = args;
      // @ts-ignore
      await c.var.cache.set(data);
      // @ts-ignore
      return originalJson(...args);
    };
    return next();
  });
}

type QueueData = {
  ex: number;
  data: string;
};

// const cacheQueue = createQueue<QueueData>("cache-queue");
// createWorker<QueueData>(
//   "cache-queue",
//   async (job) => {
//     const { ex, data } = job.data;
//     return await redis.setex(job.name, ex, data);
//   },
//   {
//     removeOnFail: {
//       age: 1 * 3600, // keep up to 1 hour
//     },
//   }
// );
