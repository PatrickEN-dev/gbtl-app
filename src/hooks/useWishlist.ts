// src/hooks/useWishlist.ts
import { useWishlistStore } from '@/store/wishlistStore'

export function useWishlist() {
  const { ids, toggle, isWishlisted } = useWishlistStore()

  return {
    toggle,
    isWishlisted,
    count: ids.length,
  }
}
