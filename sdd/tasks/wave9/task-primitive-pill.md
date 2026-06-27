# Wave 9 / Task — Pill primitive

## Spec source
Read `sdd/specs/redesign-trendora-v3.md` — "Pill.tsx" subsection.
Read `sdd/tasks/shared-imports.md`.

## File to create

`src/components/primitives/Pill.tsx`

## Requirements

Single component (NOT compound), default export `Pill`.

```ts
interface PillProps {
  variant?: 'solid' | 'outline' | 'ghost'   // default 'solid'
  tone?:    'primary' | 'accent' | 'surface' // default 'primary'
  size?:    'sm' | 'md' | 'lg'              // default 'md'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onPress?: () => void
  className?: string
  children: React.ReactNode
}
```

### Behavior

Renders a `Pressable` wrapped in `Animated.View` with `usePressScale(0.95)`.
Inner container className: `rounded-pill flex-row items-center justify-center` + size + variant×tone.

Size map:
- sm: `h-7 px-3 gap-1`
- md: `h-9 px-4 gap-1.5`
- lg: `h-11 px-5 gap-2`

Variant + tone (computed `bg-X border-X` className AND a `textColor` value passed to Typography):

```ts
function styleFor(variant, tone) {
  if (variant === 'solid') {
    if (tone === 'primary') return { cls: 'bg-primary', text: 'white' }
    if (tone === 'accent')  return { cls: 'bg-accent', text: 'white' }
    if (tone === 'surface') return { cls: 'bg-surface border border-border', text: 'primary' }
  }
  if (variant === 'outline') {
    if (tone === 'primary') return { cls: 'border border-primary bg-transparent', text: 'primary' }
    if (tone === 'accent')  return { cls: 'border border-accent bg-transparent', text: 'accent' }
    if (tone === 'surface') return { cls: 'border border-border bg-transparent', text: 'primary' }
  }
  // ghost
  if (tone === 'primary') return { cls: 'bg-transparent', text: 'primary' }
  if (tone === 'accent')  return { cls: 'bg-transparent', text: 'accent' }
  return { cls: 'bg-transparent', text: 'primary' }
}
```

### Children handling

If `typeof children === 'string'` → wrap in `<Typography variant="body-sm" weight="semibold" color={textColor}>`. Otherwise render children as-is.

### Icons

Render `leftIcon` (if any) before children, and `rightIcon` after. They're React nodes — the caller sizes/colors them.

## Imports

```ts
import React from 'react'
import { Pressable } from 'react-native'
import Animated from 'react-native-reanimated'
import Typography from '@/components/ui/Typography'
import { usePressScale } from '@/lib/animations'
```

## Hard rules
- Default export `Pill`
- NEVER raw `<Text>` — Typography only for string children
- No hex literals — use className tokens
- Reanimated only
- File ≤110 lines

## Acceptance
- `npx tsc --noEmit` clean
- `<Pill>Trending</Pill>` renders dark pill with white "Trending" text
- `<Pill variant="ghost" tone="primary">Shows</Pill>` renders transparent pill with dark text
- `<Pill leftIcon={<X size={14}/>} onPress={...}>Filter</Pill>` renders with icon + text
- Pressing animates scale
