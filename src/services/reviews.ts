import { api, ApiError } from '@/lib/api'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'
import { reviewListSchema, reviewSchema } from '@/schemas/product.schema'
import type { ProductReview } from '@/types'

const mockBank: Record<string, ProductReview[]> = {
  default: [
    {
      id: 'r1',
      productId: 'p001',
      userId: 'u1',
      userName: 'Marina S.',
      rating: 5,
      title: 'Tecido incrível',
      body: 'Acabamento impecável, caimento ótimo. A polo lisa mais confortável que já tive.',
      createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'r2',
      productId: 'p001',
      userId: 'u2',
      userName: 'Rafael L.',
      rating: 4,
      body: 'Piquet de qualidade. Achei a gola um pouco mais larga que o esperado.',
      createdAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
    },
  ],
}

function isValidProductId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{1,64}$/.test(id)
}

export async function listReviews(productId: string): Promise<ProductReview[]> {
  if (!isValidProductId(productId)) return []
  if (env.useMockData) {
    return mockBank[productId] ?? mockBank.default ?? []
  }
  try {
    const raw = await api.get<unknown>(
      `/products/${encodeURIComponent(productId)}/reviews`,
    )
    const parsed = reviewListSchema.safeParse(raw)
    if (!parsed.success) {
      logger.warn('reviews.invalid_response')
      return []
    }
    return parsed.data as ProductReview[]
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return []
    throw e
  }
}

export async function submitReview(input: {
  productId: string
  userId: string
  userName: string
  rating: number
  title?: string
  body: string
}): Promise<ProductReview> {
  if (!isValidProductId(input.productId)) {
    throw new Error('Invalid product id')
  }
  // Sanitize before sending: trim and clamp lengths to schema maxima
  const payload = {
    id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    productId: input.productId,
    userId: input.userId.slice(0, 64),
    userName: input.userName.trim().slice(0, 80),
    rating: Math.max(1, Math.min(5, Math.round(input.rating))),
    title: input.title?.trim().slice(0, 200),
    body: input.body.trim().slice(0, 2000),
    createdAt: Date.now(),
  }
  const validated = reviewSchema.parse(payload)
  if (!env.useMockData) {
    await api.post(`/products/${encodeURIComponent(input.productId)}/reviews`, validated)
  }
  return validated as ProductReview
}
