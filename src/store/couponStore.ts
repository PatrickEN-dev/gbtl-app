import { create } from 'zustand'
import type { Coupon } from '@/types'

interface CouponStore {
  applied: Coupon | null
  apply: (coupon: Coupon) => void
  clear: () => void
}

export const useCouponStore = create<CouponStore>()((set) => ({
  applied: null,
  apply: (coupon) => set({ applied: coupon }),
  clear: () => set({ applied: null }),
}))
