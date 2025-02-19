import { Queue, Worker } from "bullmq";
import { Processor, WorkerOptions } from "bullmq";

import redis from "./redis";

export const createQueue = <T>(
  ...args: ConstructorParameters<typeof Queue>
) => {
  const [name, opts, ...rest] = args;

  const queue = new Queue<T>(
    name,
    {
      ...opts,
      connection: redis,
    },
    ...rest
  );
  return queue;
};

export const createWorker = <T>(
  name: string,
  callback: Processor<T, string, string>,
  opts?: WorkerOptions
) => {
  const worker = new Worker(name, callback, {
    connection: redis,
    ...opts,
  });

  return worker;
};
