import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ── Upstash-backed limiter (production) ──────────────────────────────────────

let ratelimiter: Ratelimit | null = null;

function getUpstashRatelimiter(): Ratelimit {
  if (!ratelimiter) {
    ratelimiter = new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      }),
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      analytics: false,
    });
  }
  return ratelimiter;
}

// ── In-memory fallback (local dev / CI) ──────────────────────────────────────

interface MemoryEntry {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, MemoryEntry>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5;

function checkMemoryLimit(identifier: string): {
  success: boolean;
  remaining: number;
  reset: number;
} {
  const now = Date.now();
  const entry = memoryStore.get(identifier);

  if (!entry || now >= entry.resetAt) {
    memoryStore.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true, remaining: MAX_REQUESTS - 1, reset: now + WINDOW_MS };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { success: false, remaining: 0, reset: entry.resetAt };
  }

  entry.count += 1;
  return {
    success: true,
    remaining: MAX_REQUESTS - entry.count,
    reset: entry.resetAt,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function checkRateLimit(
  identifier: string
): Promise<{ success: boolean; remaining: number; reset: number }> {
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    try {
      const result = await getUpstashRatelimiter().limit(identifier);
      return {
        success: result.success,
        remaining: result.remaining,
        reset: result.reset,
      };
    } catch {
      // Fail open — allow request if Upstash is temporarily unavailable
      return { success: true, remaining: 0, reset: 0 };
    }
  }

  // Local dev: use in-memory store
  return checkMemoryLimit(identifier);
}
