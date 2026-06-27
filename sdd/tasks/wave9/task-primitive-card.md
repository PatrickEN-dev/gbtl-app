# Wave 9 / Task — Card primitive

## Spec source
Read `sdd/specs/redesign-trendora-v3.md` — "Card.tsx" subsection.
Read `sdd/tasks/shared-imports.md` for shared imports.

## File to create

`src/components/primitives/Card.tsx`

## Requirements

Compound component exported as a single object `Card`:

```ts
export const Card = { Root, Body, Header, Footer }
```

### Card.Root

```ts
interface CardRootProps {
  variant?: 'surface' | 'elevated' | 'flat'  // default 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'      // default 'md'
  rounded?: 'card' | 'pill' | 'lg' | 'none'  // default 'card'
  className?: string
  style?: import('react-native').ViewStyle | import('react-native').ViewStyle[]
  children: React.ReactNode
}
```

Renders a single `<View>` with computed className + (if elevated) iOS+Android shadow via style.

Variant map (className):
- surface: `bg-surface`
- elevated: `bg-surface`
- flat: `bg-transparent`

Padding map: none='', sm='p-2', md='p-4', lg='p-6'.

Rounded map: card='rounded-card', pill='rounded-pill', lg='rounded-2xl', none=''.

Elevated shadow (only applied when variant='elevated'):
```ts
const shadow = {
  shadowColor: colors.primary,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 2,
}
```
where `colors = useThemeColors()`.

Final className assembly:
```ts
const className = ['', variantClass[variant], paddingClass[padding], roundedClass[rounded], userClassName].filter(Boolean).join(' ')
```

User-provided `style` prop must be merged: `style={[shadow, userStyle].filter(Boolean)}`.

### Card.Body

```ts
interface CardBodyProps {
  gap?: 'sm' | 'md' | 'lg'  // default 'md'
  className?: string
  children: React.ReactNode
}
```

Renders `<View className={`gap-${gapClass[gap]} ${className ?? ''}`}>`. Gap map: sm='2', md='3', lg='4'.

### Card.Header

`<View className="flex-row items-center justify-between mb-3">{children}</View>`. No props beyond children.

### Card.Footer

`<View className="flex-row items-center justify-end gap-2 mt-3">{children}</View>`. No props beyond children.

## Imports

```ts
import React from 'react'
import { View, type ViewStyle } from 'react-native'
import { useThemeColors } from '@/hooks/useThemeColors'
```

## Hard rules
- NEVER use raw `<Text>` — but Card primitives don't render text, so this shouldn't come up
- No hex literals — use `useThemeColors()` for shadowColor
- Use `bg-surface` className, not Colors.surface
- Compound API via `export const Card = { Root, Body, Header, Footer }`
- File ≤120 lines

## Acceptance
- `npx tsc --noEmit` clean
- `<Card.Root variant="elevated" padding="md"><Card.Body>...</Card.Body></Card.Root>` renders a white rounded card with light shadow
- `<Card.Root variant="flat" padding="none">` renders transparent with no padding/shadow
- Custom `className` prop is appended to computed classes
