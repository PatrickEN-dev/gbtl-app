// src/types/index.ts

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

export type RootStackParamList = {
  '(tabs)': undefined
  '(auth)/login': undefined
  'product/[id]': { id: string }
}
