# Wave 5 / Task B — Tab Screens

## Spec source
- `## SCREENS` (lines 487–521) — Home, Collection, Cart, Profile specs
- `## COMPONENT LOADING STATES` (lines 582–592)
- Read wave 3/4 component exports before writing screens

## Files to generate

1. `app/(tabs)/_layout.tsx`
   - `<Tabs tabBar={(props) => <TabBar {...props} />}>`
   - 4 tabs: index (Home), collection (Collection), cart (Cart), profile (Profile)
   - Each tab: `headerShown: false`

2. `app/(tabs)/index.tsx` — Home screen (≤150 lines)
   - `ScreenWrapper` scrollable — gets `scrollY` SharedValue
   - Hero banner: full-width expo-image with `useParallax(scrollY, 0.3)`, Typography display "YOUR VISION YOUR STYLE", Button primary "Explore Collection" → `router.push('/(tabs)/collection')`
   - Category chips: `['All', 'Men', 'Women', 'Kids']`, horizontal FlatList, `useState` for active, Reanimated `withTiming` on chip background color
   - `<ProductGrid>` passing selected category to `useProducts(category)`

3. `app/(tabs)/collection.tsx` — Collection screen (≤150 lines)
   - `<Header title="Collection" />`
   - Sort bar: `['Relevance', 'Price ↑', 'Price ↓', 'Newest']` — local state, sort products client-side
   - `const { data, isPending, isError, refetch } = useProducts()`
   - Skeleton (isPending), Error (isError), Empty (data=[]), ProductGrid (data)

4. `app/(tabs)/cart.tsx` — Cart screen (≤150 lines)
   - `<Header title="Cart" />`
   - If `items.length === 0`: EmptyState with ShoppingBag icon + "Browse Collection" → `/(tabs)/collection`
   - Else: FlatList of CartItem + sticky footer CartSummary + "Checkout" Button → `useBottomSheet().present()`
   - CheckoutForm inside `<BottomSheetModal ref={sheetRef}>`

5. `app/(tabs)/profile.tsx` — Profile screen (≤150 lines)
   - `<Header title="Profile" />`
   - Avatar circle with initials from `user?.name`, `useScaleIn()` on mount
   - Menu rows (TouchableOpacity with chevron): Orders (placeholder), Wishlist (placeholder), Settings (placeholder)
   - Logout row: `useAuth().logout()` → `router.replace('/(auth)/login')`
   - Request notification permission on mount: `expo-notifications` `requestPermissionsAsync()`
