

import type { Product } from '@/types'
import { mockProducts } from '@/data/mockProducts'

export function fetchProducts(category?: string): Promise<Product[]> {
  return new Promise((resolve) =>
    setTimeout(() => {
      const result =
        category && category !== 'all'
          ? mockProducts.filter((p) => p.category === category)
          : mockProducts
      resolve(result)
    }, 300)
  )
}

export function fetchProduct(id: string): Promise<Product> {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      const p = mockProducts.find((p) => p.id === id)
      p ? resolve(p) : reject(new Error('Product not found'))
    }, 300)
  )
}
