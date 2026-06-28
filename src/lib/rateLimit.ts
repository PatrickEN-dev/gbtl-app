/**
 * Local rate-limit usando token bucket — protege endpoints sensíveis
 * contra cliques múltiplos rápidos (checkout, cupom, etc.).
 */
const buckets = new Map<string, { tokens: number; lastRefill: number }>()

interface RateLimitConfig {
  /** Operations allowed per minute */
  perMinute: number
  /** Max burst (capacity) */
  burst?: number
}

export function rateLimit(key: string, config: RateLimitConfig): boolean {
  const now = Date.now()
  const capacity = config.burst ?? config.perMinute
  const refillRate = config.perMinute / 60_000 // tokens per ms

  const bucket = buckets.get(key) ?? { tokens: capacity, lastRefill: now }
  const elapsed = now - bucket.lastRefill
  bucket.tokens = Math.min(capacity, bucket.tokens + elapsed * refillRate)
  bucket.lastRefill = now

  if (bucket.tokens < 1) {
    buckets.set(key, bucket)
    return false
  }
  bucket.tokens -= 1
  buckets.set(key, bucket)
  return true
}

export function resetRateLimit(key: string): void {
  buckets.delete(key)
}
