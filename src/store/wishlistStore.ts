import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface WishlistStore {
  ids: string[]
  toggle: (productId: string) => void
  clear: () => void
  isWishlisted: (productId: string) => boolean
  selectCount: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
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
    }),
    {
      name: 'gbtl:wishlist',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      partialize: (state) => ({ ids: state.ids }),
    },
  ),
)
