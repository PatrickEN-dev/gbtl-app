import { useCartStore } from '@/store/cartStore'
import { useCouponStore } from '@/store/couponStore'
import { applyCouponMath } from '@/services/coupons'

// BRL — frete grátis acima de R$ 199, fixo de R$ 19,90 abaixo disso
const FREE_SHIPPING_THRESHOLD = 199
const FLAT_SHIPPING = 19.9

export function useCart() {
  const store = useCartStore()
  const coupon = useCouponStore((s) => s.applied)

  const totalItems = store.items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = store.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const baseShipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING

  const { discount, finalShipping } = applyCouponMath(subtotal, baseShipping, coupon)
  const deliveryFee = finalShipping
  const total = Math.max(0, subtotal + deliveryFee - discount)

  return {
    ...store,
    coupon,
    totalItems,
    subtotal,
    deliveryFee,
    discount,
    total,
  }
}
