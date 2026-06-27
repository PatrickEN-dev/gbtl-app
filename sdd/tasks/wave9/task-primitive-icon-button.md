# Wave 9 / Task — IconButton primitive

## Spec source
Read `sdd/specs/redesign-trendora-v3.md` — "IconButton.tsx" subsection.

## File to create

`src/components/primitives/IconButton.tsx`

## Requirements

Single component, default export `IconButton`.

```ts
interface IconButtonProps {
  icon: React.ReactNode
  onPress?: () => void
  variant?: 'surface' | 'ghost' | 'primary'  // default 'surface'
  size?: 'sm' | 'md' | 'lg'                  // default 'md'
  badge?: number                              // shows Badge top-right when > 0
  className?: string
  accessibilityLabel?: string
}
```

### Behavior

Renders a `Pressable` wrapped in `Animated.View` with `usePressScale(0.9)`. Inner square container is `rounded-full items-center justify-center` with size-driven width/height.

Size map (both width and height):
- sm: 32
- md: 40
- lg: 48

Variant map (className + optional shadow):
- surface: `bg-surface border border-border` + iOS shadow (color from `useThemeColors().primary`, offset {0,1}, opacity 0.06, radius 4) + Android elevation 2
- ghost: `bg-transparent`
- primary: `bg-primary`

Badge overlay:
- When `badge != null && badge > 0`, render `<View className="absolute -top-1 -right-1"><Badge variant="accent" size="sm">{badge}</Badge></View>` inside the inner container.

Pressable should include `hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}` and forward `accessibilityLabel`.

## Imports

```ts
import React from 'react'
import { Pressable, View } from 'react-native'
import Animated from 'react-native-reanimated'
import Badge from '@/components/ui/Badge'
import { useThemeColors } from '@/hooks/useThemeColors'
import { usePressScale } from '@/lib/animations'
```

## Hard rules
- Default export `IconButton`
- No raw Text
- Use `useThemeColors()` for the shadowColor JS-side value (NEVER hardcode hex)
- Both iOS shadow + Android elevation
- Reanimated only
- File ≤100 lines

## Acceptance
- `npx tsc --noEmit` clean
- `<IconButton icon={<X size={14} color={...}/>} />` renders 40x40 white circle with subtle shadow + the X icon centered
- `<IconButton icon={...} variant="primary" />` renders dark filled circle
- `<IconButton icon={...} variant="ghost" badge={5} />` renders transparent circle with the icon and a red badge at top-right
- Pressing triggers the press scale animation
