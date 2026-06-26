# Wave 5 / Task B — Tab Screens

## Spec source
Read `sdd/specs/screens.md` — contains full `## SCREENS` section (Home, Collection, Cart, Profile specs) and `## COMPONENT LOADING STATES`.
Also read `sdd/tasks/shared-imports.md` for wave 3/4 component import paths.

## Files to generate

1. `app/(tabs)/_layout.tsx`
   - `<Tabs tabBar={(props) => <TabBar {...props} />}>`
   - 4 tabs: index (Home), collection (Collection), cart (Cart), profile (Profile)
   - Each tab: `headerShown: false`

2. `app/(tabs)/index.tsx` — Home screen (≤150 lines)
   - `ScreenWrapper` scrollable — gets `scrollY` SharedValue

   **Header area** (transparent, absolute):
   - Typography heading2 color=primary "GBTL" (brand wordmark, left-aligned)
   - ShoppingBag icon (right) with cart badge from `useCart().totalItems` → `router.push('/(tabs)/cart')`

   **Hero banner** (aspect ratio 3:4 — portrait, fashion-appropriate):
   - expo-image with `useParallax(scrollY, 0.3)`
   - Dark gradient overlay at bottom (via absolute View bg-overlay opacity-60)
   - Typography heading1 color=white "New Arrivals" (bottom-left of image)
   - Button primary size=sm "Shop Now" → `router.push('/(tabs)/collection')` (bottom-left, below title)

   **Category chips** (below hero, horizontal FlatList, no scroll indicator):
   - `['All', 'Men', 'Women', 'Kids']`
   - Active chip: bg-primary text-white rounded-pill | Inactive: bg-surface border-border text-primary
   - Reanimated `withTiming` on background color change
   - `usePressScale(0.95)` on each chip

   **ProductGrid** — passes active category to `useProducts(category)`

3. `app/(tabs)/collection.tsx` — Collection screen (≤150 lines)
   - `<Header title="Collection" />`
   - Sort bar: `['Relevance', 'Price ↑', 'Price ↓', 'Newest']` — local state, sort products client-side
   - `const { data, isPending, isError, refetch } = useProducts()`
   - Skeleton (isPending), Error (isError), Empty (data=[]), ProductGrid (data)

4. `app/(tabs)/cart.tsx` — Cart screen (≤150 lines)
   - `<Header title="Cart" />`
   - `const { items } = useCart()`
   - `const { isAuthenticated } = useAuth()`
   - `const { ref, present } = useBottomSheet()`

   **Empty cart**: EmptyState with ShoppingBag icon, title "Your cart is empty", action "Browse Collection" → `router.push('/(tabs)/collection')`

   **Cart with items**:
   - FlatList of `<CartItem item={i} onRemove={() => removeItem(...)} />`
   - Sticky footer: `<CartSummary />`
   - Button primary fullWidth "Checkout"
     - If `!isAuthenticated`: `router.push('/(auth)/login')` (login required for checkout)
     - If `isAuthenticated`: `present()` (open checkout bottom sheet)
   - `<BottomSheetModal ref={ref} snapPoints={['75%', '90%']}>`
       `<CheckoutForm />`
     `</BottomSheetModal>`

5. `app/(tabs)/profile.tsx` — Profile screen (≤150 lines)
   - `<Header title="Profile" />`
   - `const { user, isAuthenticated, logout } = useAuth()`

   **Guest state** (when `!isAuthenticated`):
   - Centered layout: Typography heading2 "Welcome" + Typography body color=muted "Sign in to access your orders and wishlist"
   - Button primary "Sign In" → `router.push('/(auth)/login')`
   - `useScaleIn()` on this guest block

   **Authenticated state** (when `isAuthenticated`):
   - Avatar circle (64×64 bg-accent) with initials from `user.name` (first+last initial), `useScaleIn()` on mount
   - Typography heading2 `user.name`
   - Typography body-sm color=muted `user.email`
   - Divider below user info
   - Menu rows (TouchableOpacity, each with ChevronRight icon): Orders, Wishlist, Settings → all placeholder (no navigation yet)
   - Divider
   - Logout row (text-accent): `logout()` → `router.replace('/(tabs)/')`
   - On mount: `Notifications.requestPermissionsAsync()` — handle granted/denied gracefully
