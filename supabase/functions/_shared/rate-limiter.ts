// Simple in-memory rate limiter (for demo)
// Production: Use Redis or Supabase database with TTL

const requestCounts = new Map<string, { count: number; resetAt: number }>()

export interface RateLimitConfig {
  maxRequests: number // Max requests per window
  windowMs: number    // Time window in milliseconds
}

export function checkRateLimit(
  identifier: string, // User ID or IP
  config: RateLimitConfig = { maxRequests: 100, windowMs: 60000 } // 100 req/min
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const existing = requestCounts.get(identifier)

  // Clean up expired entries
  if (existing && existing.resetAt < now) {
    requestCounts.delete(identifier)
  }

  const current = requestCounts.get(identifier) || {
    count: 0,
    resetAt: now + config.windowMs,
  }

  if (current.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: current.resetAt,
    }
  }

  current.count++
  requestCounts.set(identifier, current)

  return {
    allowed: true,
    remaining: config.maxRequests - current.count,
    resetAt: current.resetAt,
  }
}