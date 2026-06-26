# Wave 2 / Task B — Custom Hooks

## Spec source
- `## DESIGN PATTERNS` (lines 253–306) — Custom Hook pattern
- Read wave 1 outputs: `src/types/index.ts`, `src/services/products.ts`, `src/services/auth.ts`, `src/store/*.ts`

## v5 CRITICAL — TanStack Query syntax
```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// CORRECT v5 object syntax:
const { data, isPending, isError, refetch } = useQuery({
  queryKey: ['products', category],
  queryFn: () => fetchProducts(category),
})

// WRONG — v4 array syntax (will throw type error in v5):
// useQuery(['products', category], fetchProducts)

// isPending = true on first load (replaces isLoading in v5)
// isLoading = isPending && isFetching (use isPending for "no data yet")
```

## Files to generate

1. `src/hooks/useProducts.ts`
   ```ts
   export function useProducts(category?: string) {
     return useQuery({
       queryKey: ['products', category ?? 'all'],
       queryFn: () => fetchProducts(category),
     })
   }
   ```

2. `src/hooks/useProduct.ts`
   ```ts
   export function useProduct(id: string) {
     return useQuery({
       queryKey: ['product', id],
       queryFn: () => fetchProduct(id),
       enabled: !!id,
     })
   }
   ```

3. `src/hooks/useCart.ts` — re-exports all cartStore selectors + actions via `useCartStore`. Returns: `{ items, totalItems, subtotal, deliveryFee, total, addItem, removeItem, updateQuantity, clearCart }`

4. `src/hooks/useWishlist.ts` — re-exports wishlistStore via `useWishlistStore`. Returns: `{ toggle, isWishlisted, count }`

5. `src/hooks/useAuth.ts`
   - `login(email, password)`: setLoading(true) → authService.login() → setToken in SecureStore → setUser() → setLoading(false)
   - `logout()`: clearUser() → deleteToken() → queryClient.clear()
   - `restoreSession()`: getToken() → if token exists → setUser with stored user (mock: create minimal AuthUser)
   - Returns: `{ user, isAuthenticated, isLoading, login, logout, restoreSession }`

6. `src/hooks/useBottomSheet.ts`
   ```ts
   import { useRef } from 'react'
   import { BottomSheetModal } from '@gorhom/bottom-sheet'
   export function useBottomSheet() {
     const ref = useRef<BottomSheetModal>(null)
     return {
       ref,
       present: () => ref.current?.present(),
       dismiss: () => ref.current?.dismiss(),
     }
   }
   ```
