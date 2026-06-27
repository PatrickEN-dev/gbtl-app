# Wave 6 / Task — Home screen rewrite (Trendora style)

## Spec source
Read `sdd/specs/redesign-trendora.md` — section "app/(tabs)/index.tsx".
Read `sdd/tasks/shared-imports.md` for the existing import paths.

## Prerequisites (assume already built in this wave)
- `src/components/ui/SearchBar.tsx` — default export `SearchBar`
- `src/components/ui/QuantityStepper.tsx` (unused here but exists)
- Existing components: `Typography`, `Badge`, `ProductGrid`, `useCart`, `useAuth`, `useProducts`, `usePressScale`, `Duration`, `Colors`

## File to generate (overwrite the existing one)

`app/(tabs)/index.tsx`  — **≤150 lines**

## Layout (top → bottom inside a single root `View bg-bg` with `flex-1`)

1. **Top row** (px-5 mb-4, marginTop = insets.top + 8, `flex-row items-center justify-between`):
   - Left group `flex-row items-center gap-3`:
     - Pressable circle 36x36 `bg-surface rounded-full overflow-hidden border border-border` containing either:
       - `<Image source={{ uri: user.avatarUrl }} style={{ width:36, height:36 }} contentFit="cover" />` when `user?.avatarUrl`
       - Otherwise `<View bg-primary w-full h-full items-center justify-center"><Typography variant="body-sm" weight="bold" color="white">{getInitials(user?.name ?? 'GB')}</Typography></View>`
       - onPress → `router.push('/(tabs)/profile')`
     - Typography heading3 weight=bold "GBTL"
   - Right: Pressable rounded-full `bg-surface border border-border w-10 h-10 items-center justify-center`, contains `ShoppingBag` size 20 color `Colors.primary` with cart Badge overlapping (re-use existing pattern); onPress → `router.push('/(tabs)/cart')`

2. **Greeting** (px-5 mb-1):
   - Typography heading1 `Hello {firstName}`
   - Typography body-sm color="muted" "Fashion confidence and reveals beauty."

3. **SearchBar** (px-5 mt-4 mb-4):
   - Local state `const [query, setQuery] = useState('')`
   - `<SearchBar value={query} onChangeText={setQuery} />`

4. **Category pills** (px-5 mb-2, horizontal FlatList, no scroll indicator):
   - Labels: `['Trending', 'Shows', 'Bag', 'Shirts']`
   - Mapping helper (defined at top of file):
     ```ts
     const CATEGORY_API: Record<string, string | undefined> = {
       Trending: undefined,
       Shows: 'women',
       Bag: 'men',
       Shirts: 'kids',
     }
     ```
   - Active pill: animated `bg-primary` with white text; inactive: transparent + `text-muted`
   - Use `usePressScale(0.95)` + `withTiming(Duration.fast)` on background color crossfade (interpolateColor between surface and primary)
   - Spacing between pills: `mr-2`

5. **ProductGrid** (flex-1):
   - `const { data, isPending, isError, refetch } = useProducts(CATEGORY_API[activeCategory])`
   - `<ProductGrid products={data ?? []} isPending={isPending} isError={isError} refetch={refetch} onProductPress={(p) => router.push(`/product/${p.id}`)} />`
   - Do NOT pass a `listHeader` (we render header content above the grid manually). Do NOT pass `scrollHandler` (no parallax this time).

## Helper

```ts
function getInitials(name: string): string {
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase()
}
```

## Required imports

```ts
import React, { useState, useEffect } from 'react'
import { View, FlatList, Pressable } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { ShoppingBag } from 'lucide-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Typography from '@/components/ui/Typography'
import Badge from '@/components/ui/Badge'
import SearchBar from '@/components/ui/SearchBar'
import ProductGrid from '@/components/product/ProductGrid'
import { usePressScale, Duration } from '@/lib/animations'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useProducts } from '@/hooks/useProducts'
import { Colors } from '@/constants/tokens'
```

## Hard rules
- ≤150 lines
- No raw `<Text>` — Typography only
- No hardcoded hex — NativeWind className; Colors.* only for JS-side values
- Use `useSafeAreaInsets()` (do not hardcode top padding)
- Reanimated only (no `Animated` from react-native)
- TanStack Query v5: `isPending`
- File path EXACT: `app/(tabs)/index.tsx` (overwrite)

## Acceptance
- `npx tsc --noEmit` clean
- Screen renders top profile row, greeting, search bar, 4 category pills, then 2-column product grid
- Tapping the avatar navigates to profile; tapping the cart icon navigates to cart with badge updating
- Switching category re-runs useProducts with the mapped API value
