import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastInput {
  type: ToastType
  title: string
  message?: string
  durationMs?: number
}

export interface Toast extends ToastInput {
  id: string
}

interface ToastStore {
  current: Toast | null
  show: (t: ToastInput) => void
  dismiss: () => void
}

let counter = 0

export const useToastStore = create<ToastStore>()((set) => ({
  current: null,
  show: (t) => {
    counter += 1
    set({ current: { ...t, id: String(counter) } })
  },
  dismiss: () => set({ current: null }),
}))

export function showToast(input: ToastInput) {
  useToastStore.getState().show(input)
}
