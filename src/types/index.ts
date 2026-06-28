export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  colors: ProductColor[]
  sizes: ProductSize[]
  category: 'men' | 'women' | 'kids'
  description: string
  rating: number
  reviewCount: number
  isFeatured?: boolean
  isNew?: boolean
  isSale?: boolean
}

export interface ProductColor {
  hex: string
  name: string
}

export interface ProductSize {
  label: string
  available: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  selectedSize: string
  selectedColor: ProductColor
}

export interface AuthUser {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

export interface Address {
  id: string
  label: string
  recipient: string
  zip: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  country: string
  phone?: string
  isDefault?: boolean
}

export type OrderStatus =
  'pending' | 'paid' | 'shipped' | 'delivered' | 'canceled' | 'refunded'

export interface OrderItem {
  productId: string
  name: string
  image: string
  size: string
  colorName: string
  colorHex: string
  unitPrice: number
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  currency: string
  status: OrderStatus
  paymentIntentId?: string
  shippingAddress?: Address
  couponCode?: string
  createdAt: number
  estimatedDelivery?: number
}

export interface Coupon {
  code: string
  type: 'percent' | 'fixed' | 'free_shipping'
  value: number
  minSubtotal?: number
  expiresAt?: number
  description: string
}

export interface ProductReview {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  title?: string
  body: string
  createdAt: number
}
