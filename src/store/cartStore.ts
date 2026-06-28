import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Product, CartItem, ProductColor } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, size: string, color: ProductColor, qty?: number) => void
  removeItem: (productId: string, size: string, colorHex: string) => void
  updateQuantity: (productId: string, size: string, colorHex: string, qty: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, size, color, qty = 1) =>
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.product.id === product.id &&
              i.selectedSize === size &&
              i.selectedColor.hex === color.hex,
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i === existing ? { ...i, quantity: i.quantity + qty } : i,
              ),
            }
          }
          return {
            items: [
              ...state.items,
              { product, quantity: qty, selectedSize: size, selectedColor: color },
            ],
          }
        }),

      removeItem: (productId, size, colorHex) =>
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.product.id === productId &&
                i.selectedSize === size &&
                i.selectedColor.hex === colorHex
              ),
          ),
        })),

      updateQuantity: (productId, size, colorHex, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter(
                  (i) =>
                    !(
                      i.product.id === productId &&
                      i.selectedSize === size &&
                      i.selectedColor.hex === colorHex
                    ),
                )
              : state.items.map((i) =>
                  i.product.id === productId &&
                  i.selectedSize === size &&
                  i.selectedColor.hex === colorHex
                    ? { ...i, quantity: qty }
                    : i,
                ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'gbtl:cart',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
