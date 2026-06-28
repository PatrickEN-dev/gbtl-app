import { useQuery } from '@tanstack/react-query'
import { listOrders, getOrder } from '@/services/orders'
import { useOrdersStore } from '@/store/ordersStore'

export function useOrders() {
  const local = useOrdersStore((s) => s.orders)
  const query = useQuery({
    queryKey: ['orders'],
    queryFn: listOrders,
    initialData: local,
  })
  return query
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => (id ? getOrder(id) : Promise.resolve(null)),
    enabled: !!id,
  })
}
