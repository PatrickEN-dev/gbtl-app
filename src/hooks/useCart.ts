
import { useCartStore } from '@/store/cartStore'

export function useCart() {
  const store = useCartStore()

  const totalItems = store.items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = store.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  )
  const deliveryFee = subtotal >= 200 ? 0 : 16
  const total = subtotal + deliveryFee

  return {
    ...store,
    totalItems,
    subtotal,
    deliveryFee,
    total,
  }
}
