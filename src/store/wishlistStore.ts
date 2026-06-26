// src/store/wishlistStore.ts
import { create } from 'zustand'

interface WishlistStore {
  ids: string[]
  toggle: (productId: string) => void
  clear: () => void
  isWishlisted: (productId: string) => boolean
  selectCount: () => number
}

export const useWishlistStore = create<WishlistStore>()((set, get) => ({
  ids: [],

  toggle: (productId) =>
    set((state) => ({
      ids: state.ids.includes(productId)
        ? state.ids.filter((id) => id !== productId)
        : [...state.ids, productId],
    })),

  clear: () => set({ ids: [] }),

  isWishlisted: (productId) => get().ids.includes(productId),

  selectCount: () => get().ids.length,
}))
