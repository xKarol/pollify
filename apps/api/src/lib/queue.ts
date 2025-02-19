import { Queue, Worker } from "bullmq";
import type { ConnectionOptions, Processor, WorkerOptions } from "bullmq";

const regex = /rediss?:\/\/([^:]+):([^@]+)@([^:]+):(\d+)/;
if (!process.env.REDIS_URL)
  throw new Error("Env variable REDIS_URL is undefined");
const match = process.env.REDIS_URL.match(regex);

if (!match) throw new Error("Invalid redis host string");

const [, username, password, host, port] = match;

const connectionCredentials: ConnectionOptions = {
  username,
  password,
  host,
  port: +port,
};

export const createQueue = <T>(
  ...args: ConstructorParameters<typeof Queue>
): Queue<T, unknown, string> => {
  const [name, opts, ...rest] = args;
  const queue = new Queue(
    name,
    { ...opts, connection: connectionCredentials },
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
    connection: connectionCredentials,
    ...opts,
  });

  return worker;
};
