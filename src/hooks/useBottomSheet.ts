// src/hooks/useBottomSheet.ts
import { useRef, useCallback } from 'react'
import { BottomSheetModal } from '@gorhom/bottom-sheet'

export function useBottomSheet() {
  const ref = useRef<BottomSheetModal>(null)

  const present = useCallback(() => {
    ref.current?.present()
  }, [])

  const dismiss = useCallback(() => {
    ref.current?.dismiss()
  }, [])

  return { ref, present, dismiss }
}
