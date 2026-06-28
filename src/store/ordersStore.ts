import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Order, OrderStatus } from '@/types'

interface OrdersStore {
  orders: Order[]
  addOrder: (order: Order) => void
  updateStatus: (id: string, status: OrderStatus) => void
  clear: () => void
  selectById: (id: string) => Order | undefined
}

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),
      updateStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
      clear: () => set({ orders: [] }),
      selectById: (id) => get().orders.find((o) => o.id === id),
    }),
    {
      name: 'gbtl:orders',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      partialize: (s) => ({ orders: s.orders }),
    },
  ),
)
