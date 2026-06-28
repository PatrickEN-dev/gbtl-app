import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Address } from '@/types'

interface AddressesStore {
  addresses: Address[]
  add: (address: Omit<Address, 'id'>) => Address
  update: (id: string, patch: Partial<Address>) => void
  remove: (id: string) => void
  setDefault: (id: string) => void
  selectDefault: () => Address | undefined
}

function genId(): string {
  return `addr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export const useAddressesStore = create<AddressesStore>()(
  persist(
    (set, get) => ({
      addresses: [],
      add: (input) => {
        const id = genId()
        const isFirst = get().addresses.length === 0
        const address: Address = { ...input, id, isDefault: input.isDefault ?? isFirst }
        set((s) => ({
          addresses: address.isDefault
            ? [address, ...s.addresses.map((a) => ({ ...a, isDefault: false }))]
            : [...s.addresses, address],
        }))
        return address
      },
      update: (id, patch) =>
        set((s) => ({
          addresses: s.addresses.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),
      remove: (id) =>
        set((s) => {
          const filtered = s.addresses.filter((a) => a.id !== id)
          if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
            filtered[0] = { ...filtered[0]!, isDefault: true }
          }
          return { addresses: filtered }
        }),
      setDefault: (id) =>
        set((s) => ({
          addresses: s.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
        })),
      selectDefault: () => get().addresses.find((a) => a.isDefault),
    }),
    {
      name: 'gbtl:addresses',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      partialize: (s) => ({ addresses: s.addresses }),
    },
  ),
)
