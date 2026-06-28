import { createRef, type RefObject } from 'react'
import { create } from 'zustand'
import type { BottomSheetModal } from '@gorhom/bottom-sheet'

export const cartSheetRef: RefObject<BottomSheetModal | null> =
  createRef<BottomSheetModal | null>()

interface CartUIStore {
  open: () => void
  close: () => void
}

export const useCartUI = create<CartUIStore>()(() => ({
  open: () => {
    cartSheetRef.current?.present()
  },
  close: () => {
    cartSheetRef.current?.dismiss()
  },
}))

export const cartUI = {
  open: () => cartSheetRef.current?.present(),
  close: () => cartSheetRef.current?.dismiss(),
}
