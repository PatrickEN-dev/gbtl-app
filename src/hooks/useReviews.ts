import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listReviews, submitReview } from '@/services/reviews'
import type { ProductReview } from '@/types'

export function useReviews(productId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => (productId ? listReviews(productId) : Promise.resolve([])),
    enabled: !!productId,
  })
}

export function useSubmitReview(productId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: submitReview,
    onSuccess: (review: ProductReview) => {
      qc.setQueryData<ProductReview[]>(['reviews', productId], (old = []) => [
        review,
        ...old,
      ])
    },
  })
}
