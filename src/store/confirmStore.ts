import { create } from 'zustand'

export interface ConfirmInput {
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
}

interface ConfirmState extends Partial<ConfirmInput> {
  open: boolean
  title: string
  resolver?: (ok: boolean) => void
}

interface ConfirmStore extends ConfirmState {
  ask: (i: ConfirmInput) => Promise<boolean>
  resolve: (ok: boolean) => void
}

export const useConfirmStore = create<ConfirmStore>()((set, get) => ({
  open: false,
  title: '',
  ask: (input) =>
    new Promise<boolean>((resolve) => {
      set({ open: true, ...input, resolver: resolve })
    }),
  resolve: (ok) => {
    const resolver = get().resolver
    set({ open: false, resolver: undefined })
    resolver?.(ok)
  },
}))

export function confirm(input: ConfirmInput): Promise<boolean> {
  return useConfirmStore.getState().ask(input)
}
