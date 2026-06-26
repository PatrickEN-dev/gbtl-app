# Wave 3 — Export Contract
# Linker reads this file to verify wave 3 outputs match these signatures
# Depends on: wave1-exports.md (animations), wave2-exports.md (useCart for TabBar badge)

## src/components/ui/Typography.tsx
Default export required:
- `Typography` (React component)
  Props: `{ variant: Variant, weight?: Weight, color?: ColorKey, className?: string, children, numberOfLines?: number, animated?: boolean }`
  Variants: display | heading1 | heading2 | heading3 | body | body-sm | caption | price
  Colors: primary | muted | accent | surface | white
  When animated=true → renders Animated.Text from react-native-reanimated

## src/components/ui/Button.tsx
Default export required:
- `Button` (React component)
  Props: `{ variant: 'primary'|'secondary'|'ghost'|'outline', size?: 'sm'|'md'|'lg', leftIcon?: ReactNode, rightIcon?: ReactNode, loading?: boolean, fullWidth?: boolean, disabled?: boolean, onPress: () => void, children: ReactNode }`
  Uses slot pattern — leftIcon/rightIcon are ReactNode (accepts any LucideIcon element)

## src/components/ui/Badge.tsx
Default export required:
- `Badge` (React component)
  Props: `{ variant?: 'primary'|'accent'|'muted'|'success', size?: 'sm'|'md', children: ReactNode }`

## src/components/ui/Divider.tsx
Default export required:
- `Divider` (React component)
  Props: `{ orientation?: 'horizontal'|'vertical', className?: string }`

## src/components/ui/EmptyState.tsx
Default export required:
- `EmptyState` (React component)
  Props: `{ icon: LucideIcon, title: string, description?: string, action?: { label: string, onPress: () => void } }`

## src/components/ui/Skeleton.tsx
Named exports required:
- `Skeleton` (React component — Props: { width?, height?, radius?, className? })
- `SkeletonGroup` (React component — renders multiple Skeleton items)
- `ProductCardSkeleton` (React component — 2-col card skeleton)
- `ProductDetailSkeleton` (React component — detail page skeleton)
  All use useShimmer() from animations.ts

## src/components/layout/ErrorBoundary.tsx
Default export required:
- `ErrorBoundary` (class component — React.Component with getDerivedStateFromError)
  Renders children when no error, fallback UI when hasError=true

## src/components/layout/ScreenWrapper.tsx
Default export required:
- `ScreenWrapper` (React component)
  Props: `{ children: ReactNode | (({ scrollY: SharedValue }) => ReactNode), scrollable?: boolean, header?: ReactNode, className?: string }`
  Uses useSafeAreaInsets() for padding — NEVER hardcode padding
  When scrollable: provides scrollY SharedValue via render prop

## src/components/layout/Header.tsx
Default export required:
- `Header` (React component)
  Props: `{ title?: string, showBack?: boolean, showCart?: boolean, transparent?: boolean, rightElement?: ReactNode }`
  showCart shows ShoppingBag icon with cart item count badge from useCart()

## src/components/layout/TabBar.tsx
Default export required:
- `TabBar` (React component)
  Props: BottomTabBarProps from @react-navigation/bottom-tabs
  iOS: BlurView wrapper (intensity=80, tint="light")
  Android: solid #FFFFFF background
  Cart tab icon shows badge count from useCart().totalItems when > 0
