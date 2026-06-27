# Wave 7 / Task — TabBar floating pill

## Spec source
Read `sdd/specs/redesign-trendora-v2.md` — "TabBar.tsx" subsection.
Read the existing file first: `src/components/layout/TabBar.tsx`.

## File to modify (rewrite)

`src/components/layout/TabBar.tsx`

## Requirements

Replace the current full-width BlurView/solid-strip implementation with a floating pill:

### Outer container

```tsx
<View
  pointerEvents="box-none"
  style={{
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    paddingHorizontal: 16,
    paddingBottom: insets.bottom + 8,
  }}
>
  <View
    className="bg-surface rounded-pill flex-row"
    style={{
      height: 64,
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 8,
    }}
  >
    {tabs}
  </View>
</View>
```

### TabItem

- `Pressable flex-1 items-center justify-center` (no label!)
- Inside an Animated.View with `usePressScale(0.9)`:
  - Icon: existing logic (24px is fine), color = `Colors.primary` when focused, `Colors.muted` when not
  - Cart badge: keep the existing absolute -top-1 -right-2 Badge overlay when badgeCount > 0
  - Active dot indicator: 5px x 5px `bg-primary rounded-full` positioned 6px BELOW the icon (use a `<View className="mt-1.5" style={{ width: 5, height: 5 }}><Animated.View ...></Animated.View></View>` pattern). Animate opacity with `withTiming(isFocused ? 1 : 0, { duration: Duration.fast })`.

### Imports

Drop the BlurView and Typography imports. Keep:

```ts
import React, { useEffect } from 'react'
import { View, Pressable } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Home, Grid, ShoppingBag, User } from 'lucide-react-native'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import Badge from '@/components/ui/Badge'
import { usePressScale, Duration } from '@/lib/animations'
import { useCart } from '@/hooks/useCart'
import { Colors } from '@/constants/tokens'
```

The `ROUTE_CONFIG` map keeps its keys but you can drop the `label` field — only Icon is needed now.

### Animation pattern for the dot

For each TabItem, create a `useSharedValue` for opacity, and a useEffect that runs `opacity.value = withTiming(isFocused ? 1 : 0, { duration: Duration.fast })`. Wrap the dot in an Animated.View whose style reads `{ opacity: opacity.value }` via useAnimatedStyle.

## Hard rules

- Reanimated only — no `Animated` from react-native
- No raw Text — but with labels removed, nothing in this file needs Typography anymore. The Badge component handles its own typography.
- Both iOS shadow + Android elevation on the pill
- `useSafeAreaInsets()` already in use — keep it
- File should be ≤120 lines

## Acceptance

- `npx tsc --noEmit` clean
- Tab bar visually floats over the screen instead of taking a full strip
- Active tab icon shows a tiny dot below it; inactive tabs do not
- Cart tab still shows its red Badge with count
- Pressing a tab navigates and the dot animates between icons
