# GBTL — Design Spec
# Scope: project structure, patterns, typography, animations
# Used by: Wave 3 (UI components) / task-ui-text-button, task-ui-base, task-ui-skeleton, task-layout

## PROJECT STRUCTURE

```
app/
  _layout.tsx                  ← Root: providers, splash, status bar
  +not-found.tsx               ← 404 screen
  (auth)/
    _layout.tsx                ← Redirect if authenticated
    login.tsx
  (tabs)/
    _layout.tsx                ← Bottom tabs: Home, Collection, Cart, Profile
    index.tsx                  ← Home
    collection.tsx
    cart.tsx
    profile.tsx
  product/
    [id].tsx                   ← ProductDetail (stack)

src/
  components/
    ui/
      Button.tsx               ← Slot pattern: icon + label + variants
      Typography.tsx           ← Typed text component (all scale variants)
      Badge.tsx
      Skeleton.tsx             ← Loading placeholder (Reanimated shimmer)
      EmptyState.tsx
      Divider.tsx
    product/
      ProductCard/
        index.tsx              ← Compound: ProductCard.Root/Image/Body/Footer
      ProductGrid.tsx
      ColorSwatch.tsx
      SizeSelector.tsx
      ImageCarousel/
        index.tsx              ← Compound: Carousel.Root/Slide/Thumbnails
    cart/
      CartItem.tsx
      CartSummary.tsx
    forms/
      Field/
        index.tsx              ← Compound: Field.Root/Label/Input/Error
      LoginForm.tsx
      CheckoutForm.tsx
    layout/
      ScreenWrapper.tsx        ← SafeArea + KeyboardAvoid + optional scroll
      Header.tsx
      TabBar.tsx               ← Custom bottom tab with blur (iOS) / solid (Android)
      ErrorBoundary.tsx
  hooks/
    useProducts.ts | useProduct.ts | useCart.ts
    useWishlist.ts | useAuth.ts | useBottomSheet.ts
  store/
    cartStore.ts | wishlistStore.ts | authStore.ts
  services/
    products.ts | auth.ts
  lib/
    queryClient.ts | secureStore.ts | animations.ts
  schemas/
    login.schema.ts | checkout.schema.ts
  types/
    index.ts
  data/
    mockProducts.ts
  constants/
    tokens.ts
```

---

## DESIGN PATTERNS

### 1. Compound Component (Composition)
Use for complex multi-part UI. Pattern: named exports under a namespace.
```tsx
<ProductCard.Root onPress={...}>
  <ProductCard.Image source={...} />
  <ProductCard.Body>
    <ProductCard.Name>{product.name}</ProductCard.Name>
    <ProductCard.Price>{product.price}</ProductCard.Price>
  </ProductCard.Body>
  <ProductCard.Footer>
    <ProductCard.WishlistButton />
  </ProductCard.Footer>
</ProductCard.Root>

// Implementation
const Root = ({ children, onPress }) => ...
ProductCard.Root = Root
ProductCard.Image = Image
// etc.
```
Apply to: ProductCard, ImageCarousel, Field (form).

### 2. Slot Pattern (Button / Icon)
```tsx
<Button variant="primary" leftIcon={<ShoppingCart size={18} />} fullWidth>
  Add to Cart
</Button>
```
Button props: `leftIcon?: React.ReactNode`, `rightIcon?: React.ReactNode`

### 3. Render Prop (ScreenWrapper scroll)
```tsx
<ScreenWrapper scrollable header={<Header title="Collection" />}>
  {({ scrollY }) => <ProductGrid animatedScrollY={scrollY} />}
</ScreenWrapper>
```

### 4. Custom Hook encapsulation
All business logic in hooks. Components only call hooks and render JSX.
Never put fetch/state logic directly in component body.

---

## TYPOGRAPHY SYSTEM

Single `<Typography>` component. All text in the app must use it — no raw `<Text>`.

```tsx
// src/components/ui/Typography.tsx
type Variant = 'display' | 'heading1' | 'heading2' | 'heading3' |
               'body' | 'body-sm' | 'caption' | 'price'
type Weight  = 'regular' | 'medium' | 'semibold' | 'bold'

interface TypographyProps {
  variant: Variant
  weight?: Weight
  color?: 'primary' | 'muted' | 'accent' | 'surface' | 'white'
  className?: string
  children: React.ReactNode
  numberOfLines?: number
  animated?: boolean  // returns Animated.Text from Reanimated
}
```

Map each variant to NativeWind className using tailwind.config fontSize tokens:
- display  → `text-display`
- heading1 → `text-heading1`
- heading2 → `text-heading2`
- heading3 → `text-heading3`
- body     → `text-body`
- body-sm  → `text-body-sm`
- caption  → `text-caption`
- price    → `text-price`

Color map to className:
- primary → `text-primary`
- muted   → `text-muted`
- accent  → `text-accent`
- surface → `text-surface`
- white   → `text-white`

When `animated={true}`, wrap with `Animated.Text` from `react-native-reanimated`.

---

## ANIMATION SYSTEM

### Animation tokens (src/lib/animations.ts)
```ts
import { Easing as ReanimatedEasing } from 'react-native-reanimated'

export const Duration = { fast: 150, base: 250, slow: 400, lazy: 600 } as const

export const Easing = {
  standard:   ReanimatedEasing.bezier(0.4, 0.0, 0.2, 1),
  decelerate: ReanimatedEasing.bezier(0.0, 0.0, 0.2, 1),
  accelerate: ReanimatedEasing.bezier(0.4, 0.0, 1, 1),
} as const

export const Spring = {
  gentle: { damping: 15, stiffness: 150 },
  snappy: { damping: 12, stiffness: 200 },
} as const
```

### Reanimated v4 import patterns (CRITICAL — v4 changed APIs)
```ts
// CORRECT v4 imports:
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  interpolate,
  runOnJS,
  Easing as ReanimatedEasing,
  FadeIn,
  FadeInUp,
  SlideInRight,
} from 'react-native-reanimated'

// For gesture handler:
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
// NOT PanGestureHandler/TapGestureHandler (v1 API — removed)
```

### Required animation presets (all in src/lib/animations.ts)
```ts
export function useFadeInUp(delay = 0) {
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(20)
  // withTiming: opacity→1, translateY→0 after delay
  // returns { animatedStyle }
}

export function useScaleIn(delay = 0) {
  const scale = useSharedValue(0.92)
  const opacity = useSharedValue(0)
  // withTiming: scale→1, opacity→1 after delay
}

export function useSlideInRight() {
  const translateX = useSharedValue(40)
  const opacity = useSharedValue(0)
  // withTiming on mount
}

export function useStagger(count: number, baseDelay: number) {
  // Returns array of {opacity, translateY} animated styles
  // Each item delayed by index × baseDelay ms
}

export function usePressScale(scale = 0.95) {
  const scaleValue = useSharedValue(1)
  const handlePressIn = () => { scaleValue.value = withSpring(scale) }
  const handlePressOut = () => { scaleValue.value = withSpring(1) }
  // returns { animatedStyle, handlePressIn, handlePressOut }
}

export function useCartBounce() {
  const scale = useSharedValue(1)
  const trigger = () => {
    scale.value = withSequence(withSpring(1.3), withSpring(1))
  }
  // returns { animatedStyle, trigger }
}

export function useShimmer() {
  const translateX = useSharedValue(-300)
  // withRepeat(withTiming(300, { duration: 1000 }), -1) on mount
  // returns animatedStyle with interpolated background gradient position
}

export function useParallax(scrollY: Animated.SharedValue<number>, factor: number) {
  // returns animatedStyle: { transform: [{ translateY: scrollY * factor }] }
}
```

### Apply animations to
- ProductCard.Root → `useFadeInUp` with stagger index × 80ms
- ProductGrid items → `useStagger` across all visible cards
- Add to Cart button → `usePressScale(0.95)` on press
- Cart badge count → `useCartBounce` when store item count changes
- Hero banner image → `useParallax` tied to HomeScreen scroll
- Screen mount → `useSlideInRight` on stack navigation
- Skeleton loaders → `useShimmer`
- ImageCarousel → Gesture.Pan() + withSpring snap
- Bottom tab icons → `useScaleIn` on active tab change
- Category chip → `usePressScale` + background color transition
