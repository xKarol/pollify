import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

redis.on("error", console.log);

export default redis;
