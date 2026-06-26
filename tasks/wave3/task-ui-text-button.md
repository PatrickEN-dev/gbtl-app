# Wave 3 / Task A — Typography + Button

## Spec source
- `## TYPOGRAPHY SYSTEM` (lines 307–331) — all 8 variants and their exact size/weight/tracking values
- `## DESIGN PATTERNS` (lines 253–306) — Slot pattern for Button icons
- `## ANIMATION SYSTEM` (lines 332–371) — usePressScale for Button

These two components are the most used in the app. Get them exactly right.

## Files to generate

1. `src/components/ui/Typography.tsx`
   - Props: `variant`, `weight?`, `color?`, `className?`, `children`, `numberOfLines?`, `animated?`
   - Variants: `display | heading1 | heading2 | heading3 | body | body-sm | caption | price`
   - Colors: `primary | muted | accent | surface | white` (map to NativeWind color classes — no hardcoded hex)
   - When `animated=true`: return `Animated.Text` from react-native-reanimated
   - Map each variant to exact className from tailwind scale (e.g. `text-display font-bold`)
   - This is THE only text component in the app — no raw `<Text>` anywhere

2. `src/components/ui/Button.tsx`
   - Props: `variant: 'primary' | 'outline' | 'ghost'`, `size: 'sm' | 'md' | 'lg'`, `leftIcon?: React.ReactNode`, `rightIcon?: React.ReactNode`, `loading?: boolean`, `fullWidth?: boolean`, `onPress`, `children`
   - Slot pattern: leftIcon and rightIcon render any React node (LucideIcon, custom icon, etc.)
   - Internally uses `usePressScale(0.96)` from animations.ts for press feedback
   - Loading state: ActivityIndicator in place of children
   - primary: bg-accent text-white shadow-btn
   - outline: border border-primary text-primary bg-transparent
   - ghost: text-primary bg-transparent no border
   - Sizes: sm=36h text-body-sm px-3 | md=48h text-body px-5 | lg=56h text-heading3 px-6
