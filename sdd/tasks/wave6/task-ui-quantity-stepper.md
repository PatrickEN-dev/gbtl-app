# Wave 6 / Task — QuantityStepper atom

## Spec source
Read `sdd/specs/redesign-trendora.md` — section "QuantityStepper".

## File to generate

`src/components/ui/QuantityStepper.tsx`

## Requirements

```ts
interface QuantityStepperProps {
  value: number
  onChange: (n: number) => void
  min?: number  // default 1
  max?: number  // default 99
}
```

Layout:
- Outer row `flex-row items-center gap-2`
- Minus button: 32x32 rounded-full `bg-surface border border-border items-center justify-center`. Disabled when `value <= min` → opacity-40 + Pressable disabled prop. Icon `Minus` size 14 color `Colors.primary`. Wrap in Animated.View with `usePressScale(0.9)`.
- Count label: Typography `body` weight=`semibold` color=`primary`. Format value as 2-digit zero-padded string: `value.toString().padStart(2, '0')`.
- Plus button: 32x32 rounded-full `bg-primary items-center justify-center`. Disabled when `value >= max`. Icon `Plus` size 14 color `Colors.surface`. Same press scale.

Handlers clamp the result:
```ts
const handleDecrement = () => onChange(Math.max(min, value - 1))
const handleIncrement = () => onChange(Math.min(max, value + 1))
```

## Imports

```ts
import React from 'react'
import { View, Pressable } from 'react-native'
import Animated from 'react-native-reanimated'
import { Minus, Plus } from 'lucide-react-native'
import Typography from '@/components/ui/Typography'
import { Colors } from '@/constants/tokens'
import { usePressScale } from '@/lib/animations'
```

## Hard rules
- Default export `QuantityStepper`
- No raw Text — Typography for the count
- No hex colors — use `Colors.*` only for lucide `color={}` and any RN-style values
- Reanimated only

## Acceptance
- `npx tsc --noEmit` clean
- Pressing minus at value=min must be a no-op (button disabled)
- Pressing plus at value=max must be a no-op
