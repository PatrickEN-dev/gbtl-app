# GBTL — Data Spec
# Scope: types, stores, forms, services, lib, schemas
# Used by: Wave 1 (task-types, task-lib) / Wave 2 (task-stores, task-hooks)

## TYPES (src/types/index.ts)

```ts
export interface Product {
  id: string           // IDs: p001–p012
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
  label: string          // XS S M L XL
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
```

---

## CONSTANTS (src/constants/tokens.ts)

Mirror tailwind.config values as TypeScript constants:
```ts
export const Colors = {
  bg:      '#F5F5F5',
  surface: '#FFFFFF',
  accent:  '#E8401C',
  primary: '#111111',
  muted:   '#888888',
  border:  '#E0E0E0',
  overlay: 'rgba(0,0,0,0.5)',
} as const

export const Radius = { card: 16, btn: 10, pill: 999, input: 10 } as const
export const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const
```

---

## STORES

### cartStore.ts (Zustand v5 — double `()()` pattern)
```ts
import { create } from 'zustand'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, size: string, color: ProductColor) => void
  removeItem: (productId: string, size: string, colorHex: string) => void
  updateQuantity: (productId: string, size: string, colorHex: string, qty: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()((set) => ({
  items: [],
  addItem: (product, size, color) => set((state) => {
    const existing = state.items.find(
      i => i.product.id === product.id && i.selectedSize === size && i.selectedColor.hex === color.hex
    )
    if (existing) {
      return { items: state.items.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i) }
    }
    return { items: [...state.items, { product, quantity: 1, selectedSize: size, selectedColor: color }] }
  }),
  removeItem: (productId, size, colorHex) => set((state) => ({
    items: state.items.filter(
      i => !(i.product.id === productId && i.selectedSize === size && i.selectedColor.hex === colorHex)
    )
  })),
  updateQuantity: (productId, size, colorHex, qty) => set((state) => ({
    items: qty <= 0
      ? state.items.filter(i => !(i.product.id === productId && i.selectedSize === size && i.selectedColor.hex === colorHex))
      : state.items.map(i =>
          i.product.id === productId && i.selectedSize === size && i.selectedColor.hex === colorHex
            ? { ...i, quantity: qty }
            : i
        )
  })),
  clearCart: () => set({ items: [] }),
}))
```

### wishlistStore.ts (Zustand v5)
```ts
interface WishlistStore {
  ids: string[]
  toggle: (productId: string) => void
  isWishlisted: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()((set, get) => ({
  ids: [],
  toggle: (productId) => set((state) => ({
    ids: state.ids.includes(productId)
      ? state.ids.filter(id => id !== productId)
      : [...state.ids, productId]
  })),
  isWishlisted: (productId) => get().ids.includes(productId),
}))
```

### authStore.ts (Zustand v5 — token ONLY in SecureStore, never in state)
```ts
interface AuthStore {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: AuthUser) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
}))

// NEVER store token in Zustand state — token lives in SecureStore only
```

---

## HOOKS

### Computed selectors (do NOT add computed fields to CartStore state)
```ts
// src/hooks/useCart.ts
export function useCart() {
  const store = useCartStore()
  const totalItems = store.items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal   = store.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const deliveryFee = subtotal >= 200 ? 0 : 16
  const total = subtotal + deliveryFee
  return { ...store, totalItems, subtotal, deliveryFee, total }
}
```

### TanStack Query v5 patterns (object syntax — no array+fn)
```ts
// src/hooks/useProducts.ts
export function useProducts(category?: string) {
  return useQuery({
    queryKey: ['products', category],
    queryFn: () => fetchProducts(category),
  })
}

// src/hooks/useProduct.ts
export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  })
}
```
Use `isPending` not `isLoading` for initial load detection.

### useAuth hook
```ts
// src/hooks/useAuth.ts
export function useAuth() {
  const store = useAuthStore()
  
  async function login(email: string, password: string) {
    const { user, token } = await authService.login(email, password)
    await setToken(token)          // SecureStore
    store.setUser(user)
  }
  
  async function logout() {
    await deleteToken()            // SecureStore
    store.clearUser()
  }
  
  async function restoreSession() {
    const token = await getToken() // SecureStore
    if (token) {
      store.setUser({ id: '1', name: 'Tavorian', email: 'tavorian@gbtl.com' })
    }
  }
  
  return { ...store, login, logout, restoreSession }
}
```

### useBottomSheet
```ts
// src/hooks/useBottomSheet.ts
export function useBottomSheet() {
  const ref = useRef<BottomSheetModal>(null)
  const present = useCallback(() => ref.current?.present(), [])
  const dismiss = useCallback(() => ref.current?.dismiss(), [])
  return { ref, present, dismiss }
}
```

---

## LIB FILES

### src/lib/queryClient.ts
```ts
import { QueryClient } from '@tanstack/react-query'
export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2, staleTime: 5 * 60 * 1000 } }
})
```

### src/lib/secureStore.ts
```ts
import * as SecureStore from 'expo-secure-store'
const TOKEN_KEY = 'gbtl_auth_token'
export const getToken    = () => SecureStore.getItemAsync(TOKEN_KEY)
export const setToken    = (v: string) => SecureStore.setItemAsync(TOKEN_KEY, v)
export const deleteToken = () => SecureStore.deleteItemAsync(TOKEN_KEY)
```

---

## FORMS (Schemas)

### src/schemas/login.schema.ts
```ts
import { z } from 'zod'
export const loginSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
export type LoginFormData = z.infer<typeof loginSchema>
```

### src/schemas/checkout.schema.ts
```ts
import { z } from 'zod'
export const checkoutSchema = z.object({
  fullName:   z.string().min(2, 'Name must be at least 2 characters'),
  address:    z.string().min(5, 'Please enter a full address'),
  city:       z.string().min(2, 'City required'),
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  expiry:     z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Format: MM/YY'),
  cvv:        z.string().regex(/^\d{3}$/, 'CVV must be 3 digits'),
})
export type CheckoutFormData = z.infer<typeof checkoutSchema>
```

---

## MOCK DATA (src/data/mockProducts.ts)

12 products total. Image URL: `https://picsum.photos/seed/gbtl-{id}/400/500` (portrait 4:5 ratio).
Use EXACTLY these names, colors, prices and flags — do not invent your own:

### Men (category: 'men')
| id   | name                      | price | originalPrice | colors (hex, name)                              | unavailable size | flags   | rating | reviews |
|------|---------------------------|-------|---------------|-------------------------------------------------|-----------------|---------|--------|---------|
| p001 | Premium Oxford Shirt      | $120  | —             | #F5F0E8 Ivory / #2C3E50 Navy / #4A4A4A Charcoal | XS              | featured | 4.8   | 312     |
| p002 | Tailored Chino Pants      | $96   | $128          | #C8B89A Camel / #2C3E50 Navy / #1A1A1A Black    | XL              | sale     | 4.5   | 198     |
| p003 | Merino Wool Sweater       | $185  | —             | #8B4513 Rust / #2F4F2F Forest / #4A4A4A Charcoal | M              | —       | 4.6   | 87      |
| p004 | Classic Denim Jacket      | $210  | —             | #4A6FA5 Blue / #2C3E50 Dark Navy / #1A1A1A Black | S              | new     | 4.7   | 54      |

### Women (category: 'women')
| id   | name                      | price | originalPrice | colors (hex, name)                              | unavailable size | flags   | rating | reviews |
|------|---------------------------|-------|---------------|-------------------------------------------------|-----------------|---------|--------|---------|
| p005 | Silk Wrap Dress           | $195  | —             | #C4A0A0 Dusty Rose / #F5F0E8 Ivory / #1A1A1A Black | XS          | featured | 4.9   | 421     |
| p006 | High-Waist Linen Trousers | $88   | $110          | #C8B89A Camel / #F5F0E8 Ivory / #2F4F2F Forest | L               | sale    | 4.3   | 265     |
| p007 | Cashmere Turtleneck       | $240  | —             | #F5F0E8 Ivory / #C4A0A0 Dusty Rose / #4A4A4A Charcoal | XL       | new     | 4.8   | 133     |
| p008 | Relaxed Linen Blazer      | $280  | —             | #4A4A4A Charcoal / #C8B89A Camel / #F5F0E8 Ivory | S             | —       | 4.7   | 78      |

### Kids (category: 'kids')
| id   | name                      | price | originalPrice | colors (hex, name)                              | unavailable size | flags   | rating | reviews |
|------|---------------------------|-------|---------------|-------------------------------------------------|-----------------|---------|--------|---------|
| p009 | Organic Cotton Set        | $85   | —             | #F5F0E8 Ivory / #A8C5A0 Sage / #C4A0A0 Dusty Rose | M            | featured | 4.6   | 189     |
| p010 | Mini Parka Jacket         | $72   | $90           | #2C3E50 Navy / #8B4513 Rust / #1A1A1A Black    | XL              | sale    | 4.4   | 142     |
| p011 | Striped Knit Pullover     | $95   | —             | #4A6FA5 Blue / #C4A0A0 Dusty Rose / #F5F0E8 Ivory | XS           | —       | 4.5   | 67      |
| p012 | Classic Denim Shorts      | $68   | —             | #4A6FA5 Blue / #1A1A1A Black / #C8B89A Camel   | L               | new     | 4.3   | 93      |

### Notes for builder
- Kids sizes: use [2Y, 4Y, 6Y, 8Y, 10Y] instead of [XS, S, M, L, XL] — same `available` logic
- description: 1–2 sentences describing fabric and fit, fashion-appropriate tone
- All products with `originalPrice` → `isSale: true`
- All `isNew` and `isFeatured` products as indicated in the table above

### src/services/products.ts
```ts
import { mockProducts } from '../data/mockProducts'

export function fetchProducts(category?: string): Promise<Product[]> {
  return new Promise(resolve =>
    setTimeout(() => {
      const result = category && category !== 'all'
        ? mockProducts.filter(p => p.category === category)
        : mockProducts
      resolve(result)
    }, 300)
  )
}

export function fetchProduct(id: string): Promise<Product> {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      const p = mockProducts.find(p => p.id === id)
      p ? resolve(p) : reject(new Error('Product not found'))
    }, 300)
  )
}
```

### src/services/auth.ts
```ts
export function login(email: string, password: string) {
  return new Promise<{ user: AuthUser; token: string }>(resolve =>
    setTimeout(() => resolve({
      user: { id: '1', name: 'Tavorian', email: 'tavorian@gbtl.com' },
      token: 'mock.jwt.eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.fake',
    }), 500)
  )
}
```
