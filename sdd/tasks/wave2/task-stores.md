# Wave 2 / Task A — Zustand Stores

## Spec source
Read `sdd/specs/data.md` — contains `## STORES` with exact Zustand v5 interface contracts and full implementation code.
Also read `src/types/index.ts` (already generated in wave 1) to import the correct types.

## v5 CRITICAL — Zustand syntax
```ts
import { create } from 'zustand'

// CORRECT v5 TypeScript pattern — double ()() required:
const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  addItem: (product, size, color) => set((state) => ({ ... })),
}))

// WRONG — single ()  breaks TypeScript inference in v5:
// const useCartStore = create<CartStore>((set) => ({ ... }))
```

## Files to generate

1. `src/store/cartStore.ts`
   - State: `items: CartItem[]`
   - Actions: `addItem(product, size, color)`, `removeItem(productId, size, colorHex)`, `updateQuantity(productId, size, colorHex, qty)`, `clearCart()`
   - Selectors (derived, not state): `totalItems`, `subtotal`, `deliveryFee` (free if subtotal > $200, else $16), `total`
   - addItem: if item with same product+size+color exists, increment qty; else push new CartItem

2. `src/store/wishlistStore.ts`
   - State: `ids: string[]` (NOT Set — Zustand v5 serializes arrays cleanly)
   - Actions: `toggle(id)`, `clear()`
   - Selectors: `isWishlisted(id): boolean`, `selectCount(): number`

3. `src/store/authStore.ts`
   - State: `user: AuthUser | null`, `isAuthenticated: boolean`, `isLoading: boolean`
   - NO `token` field anywhere in state — token lives only in SecureStore
   - Actions: `setUser(user: AuthUser)`, `clearUser()`, `setLoading(isLoading: boolean)`
   - `isAuthenticated` derives from `user !== null` — update it in setUser/clearUser
