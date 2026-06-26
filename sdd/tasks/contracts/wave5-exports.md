# Wave 5 — Export Contract
# Linker reads this file to verify wave 5 outputs match these signatures
# Depends on: waves 1–4 all verified. This is the final assembly wave.
# Note: tester also runs `tsc --noEmit` after wave 5 completes.

## File existence checks (linker: grep for default export in each)

### app/_layout.tsx
- File must exist
- Line 1 MUST contain: `import 'react-native-gesture-handler'`
- Default export: root layout function component
- Must contain: `GestureHandlerRootView`, `QueryClientProvider`, `BottomSheetModalProvider`, `Stack`

### app/+not-found.tsx
- File must exist
- Default export: not-found screen component
- Must render: `EmptyState` with AlertCircle icon

### app/(auth)/_layout.tsx
- File must exist
- Default export: auth group layout
- Must contain: `Redirect` (from expo-router) used when `isAuthenticated`

### app/(auth)/login.tsx
- File must exist
- Default export: login screen component
- Must render: `LoginForm`

### app/(tabs)/_layout.tsx
- File must exist
- Default export: tabs layout component
- Must contain: `<Tabs` with `tabBar` prop referencing `TabBar`
- Must define exactly 4 tab screens: `index`, `collection`, `cart`, `profile`

### app/(tabs)/index.tsx
- File must exist
- Default export: Home screen (≤150 lines)
- Must use: `useProducts`, `ProductGrid`, `useParallax`

### app/(tabs)/collection.tsx
- File must exist
- Default export: Collection screen (≤150 lines)
- Must use: `useProducts`, `ProductGrid`

### app/(tabs)/cart.tsx
- File must exist
- Default export: Cart screen (≤150 lines)
- Must use: `useCart`, `CartItem`, `CartSummary`, `BottomSheetModal`

### app/(tabs)/profile.tsx
- File must exist
- Default export: Profile screen (≤150 lines)
- Must use: `useAuth`

### app/product/[id].tsx
- File must exist
- Default export: ProductDetail screen (≤150 lines)
- Must use: `useProduct`, `useLocalSearchParams`, `ImageCarousel`, `ColorSwatch`, `SizeSelector`

## Cleanup verification (linker: assert these files do NOT exist)
- `app/(tabs)/explore.tsx` — MUST be deleted (Expo default — conflicts with collection route)
- `app/modal.tsx` — MUST be deleted (Expo default — not part of GBTL structure)