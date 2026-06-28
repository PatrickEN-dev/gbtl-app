import { api, ApiError } from '@/lib/api'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'
import { productListSchema, productSchema } from '@/schemas/product.schema'
import type { Product } from '@/types'
import { mockProducts } from '@/data/mockProducts'

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms))
}

function safeParseList(raw: unknown): Product[] | null {
  const result = productListSchema.safeParse(raw)
  if (!result.success) {
    logger.warn('products.invalid_response', {
      issues: result.error.issues.slice(0, 3).map((i) => i.path.join('.')),
    })
    return null
  }
  return result.data as Product[]
}

function safeParseOne(raw: unknown): Product | null {
  const result = productSchema.safeParse(raw)
  if (!result.success) {
    logger.warn('product.invalid_response', {
      issues: result.error.issues.slice(0, 3).map((i) => i.path.join('.')),
    })
    return null
  }
  return result.data as Product
}

// Regex montada via `new RegExp` para evitar bytes de controle literais no arquivo-fonte
const CONTROL_CHARS = new RegExp('[\\x00-\\x1F\\x7F]', 'g')

function sanitizeQuery(q: string): string {
  return q.replace(CONTROL_CHARS, '').slice(0, 80).trim()
}

export async function fetchProducts(category?: string): Promise<Product[]> {
  if (!env.useMockData) {
    try {
      const path =
        category && category !== 'all'
          ? `/products?category=${encodeURIComponent(category)}`
          : '/products'
      const raw = await api.get<unknown>(path)
      const validated = safeParseList(raw)
      if (validated) return validated
    } catch (e) {
      if (!(e instanceof ApiError)) throw e
    }
  }
  await delay(300)
  return category && category !== 'all'
    ? mockProducts.filter((p) => p.category === category)
    : mockProducts
}

export async function fetchProduct(id: string): Promise<Product> {
  // ID precisa ser slug seguro — protege contra path traversal antes do encode
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(id)) {
    throw new Error('Invalid product id')
  }
  if (!env.useMockData) {
    try {
      const raw = await api.get<unknown>(`/products/${encodeURIComponent(id)}`)
      const validated = safeParseOne(raw)
      if (validated) return validated
    } catch (e) {
      if (!(e instanceof ApiError)) throw e
    }
  }
  await delay(300)
  const p = mockProducts.find((p) => p.id === id)
  if (!p) throw new Error('Product not found')
  return p
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = sanitizeQuery(query)
  if (!q) return env.useMockData ? mockProducts : []
  if (!env.useMockData) {
    try {
      const raw = await api.get<unknown>(`/products/search?q=${encodeURIComponent(q)}`)
      const validated = safeParseList(raw)
      if (validated) return validated
    } catch (e) {
      if (!(e instanceof ApiError)) throw e
    }
  }
  await delay(200)
  const needle = q.toLowerCase()
  return mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(needle) ||
      p.description.toLowerCase().includes(needle),
  )
}
