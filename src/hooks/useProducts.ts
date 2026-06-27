
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '@/services/products'

export function useProducts(category?: string) {
  return useQuery({
    queryKey: ['products', category ?? 'all'],
    queryFn: () => fetchProducts(category),
  })
}
