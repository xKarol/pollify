import Redis from "ioredis";

if (!process.env.REDIS_URL)
  throw new Error("Env variable REDIS_URL is undefined");

const redis = new Redis(process.env.REDIS_URL);

export default redis;
