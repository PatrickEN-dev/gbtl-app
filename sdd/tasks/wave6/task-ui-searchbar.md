# Wave 6 / Task — SearchBar atom

## Spec source
Read `sdd/specs/redesign-trendora.md` — section "SearchBar".
Read `sdd/tasks/shared-imports.md` for available imports.

## File to generate

`src/components/ui/SearchBar.tsx`

## Requirements

Pill-shaped input row used in the Home screen.

```ts
interface SearchBarProps {
  value: string
  onChangeText: (v: string) => void
  onFilterPress?: () => void
  placeholder?: string  // default "Search here"
}
```

Layout:
- Outer `View` with `bg-surface rounded-pill border border-border flex-row items-center pl-4 pr-1.5` and explicit height 48 (use a style prop with `{ height: 48 }`)
- Add light shadow (iOS: `shadowColor: Colors.primary, shadowOffset: {width:0,height:1}, shadowOpacity: 0.04, shadowRadius: 4`; Android: `elevation: 1`)
- Left: lucide `Search` size 18 color `Colors.muted`
- Middle: `TextInput` with `className="flex-1 ml-3 text-body text-primary"`, `placeholderTextColor={Colors.muted}`, value, onChangeText. Use a fixed `style={{ paddingVertical: 0 }}` to prevent default RN vertical padding skewing height.
- Right: Pressable rounded-pill `bg-primary h-9 px-4 flex-row items-center gap-1.5` containing `SlidersHorizontal` size 14 color `Colors.surface` and a Typography `body-sm` color `white` weight `semibold` "Filter". Wrap in Animated.View with `usePressScale(0.95)`. Use `Pressable onPress={onFilterPress}`.

## Imports

```ts
import React from 'react'
import { View, TextInput, Pressable } from 'react-native'
import Animated from 'react-native-reanimated'
import { Search, SlidersHorizontal } from 'lucide-react-native'
import Typography from '@/components/ui/Typography'
import { Colors } from '@/constants/tokens'
import { usePressScale } from '@/lib/animations'
```

## Hard rules
- Never use raw `<Text>` for the "Filter" label — use Typography
- Use NativeWind className for styling; only use `Colors.*` constants for JS-side values (TextInput placeholderTextColor, lucide icon color, shadowColor)
- TextInput is a React Native primitive and is allowed
- Default export `SearchBar`

## Acceptance
- File compiles with `npx tsc --noEmit`
- No `<Text` outside Typography
- No raw hex
- No `from 'react-native'` import containing `Animated`
