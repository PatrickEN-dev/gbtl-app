# Wave 2 — Export Contract
# Linker reads this file to verify wave 2 outputs match these signatures
# Depends on: wave1-exports.md (imports from src/types, src/lib, src/services, src/schemas)

## src/store/cartStore.ts
Named exports required:
- `useCartStore` (Zustand store hook)
  State: `items: CartItem[]`
  Actions: `addItem`, `removeItem`, `updateQuantity`, `clearCart`
  Pattern: `create<CartStore>()((set) => ...)` — double ()() required

## src/store/wishlistStore.ts
Named exports required:
- `useWishlistStore` (Zustand store hook)
  State: `ids: string[]`
  Actions: `toggle(productId: string)`, `isWishlisted(productId: string): boolean`
  Pattern: `create<WishlistStore>()((set, get) => ...)`

## src/store/authStore.ts
Named exports required:
- `useAuthStore` (Zustand store hook)
  State: `user: AuthUser | null`, `isAuthenticated: boolean`, `isLoading: boolean`
  Actions: `setUser(user: AuthUser)`, `clearUser()`
  CRITICAL: NO token field in state — token lives only in SecureStore

## src/hooks/useProducts.ts
Named exports required:
- `useProducts` (function: (category?: string) => UseQueryResult<Product[]>)
  Uses TanStack v5 object syntax: `useQuery({ queryKey: ['products', category], queryFn: ... })`

## src/hooks/useProduct.ts
Named exports required:
- `useProduct` (function: (id: string) => UseQueryResult<Product>)
  Uses TanStack v5 object syntax: `useQuery({ queryKey: ['product', id], queryFn: ..., enabled: !!id })`

## src/hooks/useCart.ts
Named exports required:
- `useCart` (function: () => CartStore & { totalItems, subtotal, deliveryFee, total })
  Computed fields: totalItems (sum quantities), subtotal, deliveryFee ($0 if ≥$200, else $16), total

## src/hooks/useWishlist.ts
Named exports required:
- `useWishlist` (function: () => { toggle, isWishlisted, count: number })

## src/hooks/useAuth.ts
Named exports required:
- `useAuth` (function: () => AuthStore & { login, logout, restoreSession })
  `login(email, password)` → calls authService, setToken, store.setUser
  `logout()` → calls deleteToken, store.clearUser
  `restoreSession()` → checks getToken, sets user if token exists

## src/hooks/useBottomSheet.ts
Named exports required:
- `useBottomSheet` (function: () => { ref: RefObject<BottomSheetModal>, present: () => void, dismiss: () => void })
