import { api, ApiError } from '@/lib/api'
import { env } from '@/lib/env'
import { useOrdersStore } from '@/store/ordersStore'
import type { Address, CartItem, Coupon, Order, OrderItem } from '@/types'

function genOrderId(): string {
  const ts = Date.now().toString(36)
  const rnd = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `ord_${ts}_${rnd}`
}

function cartItemsToOrderItems(items: CartItem[]): OrderItem[] {
  return items.map((i) => ({
    productId: i.product.id,
    name: i.product.name,
    image: i.product.images[0] ?? '',
    size: i.selectedSize,
    colorName: i.selectedColor.name,
    colorHex: i.selectedColor.hex,
    unitPrice: i.product.price,
    quantity: i.quantity,
  }))
}

interface CreateOrderInput {
  userId: string
  items: CartItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  paymentIntentId?: string
  shippingAddress?: Address
  coupon?: Coupon | null
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const order: Order = {
    id: genOrderId(),
    userId: input.userId,
    items: cartItemsToOrderItems(input.items),
    subtotal: input.subtotal,
    shipping: input.shipping,
    discount: input.discount,
    total: input.total,
    currency: 'brl',
    status: input.paymentIntentId ? 'paid' : 'pending',
    paymentIntentId: input.paymentIntentId,
    shippingAddress: input.shippingAddress,
    couponCode: input.coupon?.code,
    createdAt: Date.now(),
    estimatedDelivery: Date.now() + 7 * 24 * 60 * 60 * 1000,
  }

  useOrdersStore.getState().addOrder(order)

  if (!env.useMockData) {
    try {
      await api.post<{ id: string }>('/orders', order)
    } catch (e) {
      if (!(e instanceof ApiError)) throw e
    }
  }
  return order
}

export async function listOrders(): Promise<Order[]> {
  if (env.useMockData) {
    return useOrdersStore.getState().orders
  }
  try {
    return await api.get<Order[]>('/orders')
  } catch {
    return useOrdersStore.getState().orders
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  const local = useOrdersStore.getState().selectById(id)
  if (local) return local
  if (env.useMockData) return null
  try {
    return await api.get<Order>(`/orders/${id}`)
  } catch {
    return null
  }
}
