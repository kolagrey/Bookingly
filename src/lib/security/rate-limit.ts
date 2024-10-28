import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // requests per window

export async function rateLimit(ip: string) {
  const key = `rate-limit:${ip}`;
  const now = Date.now();
  const windowStart = now - WINDOW_SIZE;

  const pipeline = redis.pipeline();
  pipeline.zremrangebyscore(key, 0, windowStart); // Remove old requests

  // Corrected zadd syntax
  pipeline.zadd(key, { score: now, member: now.toString() }); // Add current request

  pipeline.zcount(key, windowStart, now); // Count requests in window
  pipeline.expire(key, 60); // Set key expiry

  const [, , count] = await pipeline.exec();
  const remaining = MAX_REQUESTS - (count as number);
  
  return {
    success: remaining > 0,
    limit: MAX_REQUESTS,
    remaining: Math.max(0, remaining),
    reset: now + WINDOW_SIZE,
  };
}
