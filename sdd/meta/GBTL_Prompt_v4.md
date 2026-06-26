# GBTL Fashion App — Build Prompt v4

## ROLE
Senior React Native engineer. Output production-ready, fully implemented code only.
Rules: no explanations between files, no TODO comments, no placeholder logic, no skipped files.
Every file must be complete and runnable.

---

## TARGET PLATFORMS
iOS 15+ and Android 12+ (API 31). Built with Expo SDK 54 + EAS Build.
The output must run on both platforms with zero native code changes.

---

## EXACT DEPENDENCY VERSIONS (use these, no substitutions)

```json
{
  "expo": "~54.0.34",
  "expo-router": "~6.0.23",
  "react-native": "0.81.5",
  "react-native-reanimated": "~4.1.1",
  "react-native-gesture-handler": "~2.28.0",
  "react-native-safe-area-context": "~5.6.0",
  "react-native-screens": "~4.16.0",
  "react-native-svg": "15.12.1",
  "nativewind": "^4.2.6",
  "tailwindcss": "^3.4.19",
  "zustand": "^5.0.14",
  "@tanstack/react-query": "^5.101.1",
  "react-hook-form": "^7.80.0",
  "@hookform/resolvers": "^5.4.0",
  "zod": "^3.25.76",
  "lucide-react-native": "^1.21.0",
  "expo-image": "~3.0.11",
  "expo-secure-store": "~15.0.8",
  "expo-notifications": "~0.32.17",
  "expo-updates": "~29.0.18",
  "expo-blur": "~15.0.8",
  "expo-status-bar": "~3.0.9",
  "expo-splash-screen": "~31.0.13",
  "expo-font": "~14.0.11",
  "@gorhom/bottom-sheet": "^5.2.14"
}
```

---

## CONFIG FILES (generate exactly as specified)

### babel.config.js
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin', // MUST be last
    ],
  };
};
```

### tailwind.config.js
```js
const { withNativeWind } = require('nativewind/metro');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg:       '#F5F5F5',
        surface:  '#FFFFFF',
        accent:   '#E8401C',
        primary:  '#111111',
        muted:    '#888888',
        border:   '#E0E0E0',
        overlay:  'rgba(0,0,0,0.5)',
      },
      fontFamily: {
        sans:      ['System'],
        display:   ['System'],
      },
      fontSize: {
        'display':    [40, { lineHeight: '44px', letterSpacing: '-1.5px', fontWeight: '700' }],
        'heading1':   [28, { lineHeight: '34px', letterSpacing: '-0.5px', fontWeight: '700' }],
        'heading2':   [22, { lineHeight: '28px', letterSpacing: '-0.3px', fontWeight: '600' }],
        'heading3':   [18, { lineHeight: '24px', letterSpacing: '0px',   fontWeight: '600' }],
        'body':       [15, { lineHeight: '22px', letterSpacing: '0px',   fontWeight: '400' }],
        'body-sm':    [13, { lineHeight: '18px', letterSpacing: '0px',   fontWeight: '400' }],
        'caption':    [11, { lineHeight: '14px', letterSpacing: '0.5px', fontWeight: '500' }],
        'price':      [20, { lineHeight: '24px', letterSpacing: '-0.5px', fontWeight: '700' }],
      },
      borderRadius: {
        card:    '16px',
        btn:     '10px',
        pill:    '999px',
        input:   '10px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.08)',
        btn:  '0 4px 16px rgba(232,64,28,0.30)',
      },
    },
  },
  plugins: [],
};
```

### metro.config.js
```js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: './global.css' });
```

### global.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### app.json
```json
{
  "expo": {
    "name": "GBTL",
    "slug": "gbtl-app",
    "version": "1.0.0",
    "scheme": "gbtl",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
    "splash": {
      "backgroundColor": "#E8401C",
      "resizeMode": "contain"
    },
    "ios": {
      "bundleIdentifier": "com.gbtl.app",
      "supportsTablet": false,
      "infoPlist": {
        "NSCameraUsageDescription": "Used for profile photo.",
        "NSUserNotificationUsageDescription": "Stay updated on orders."
      }
    },
    "android": {
      "package": "com.gbtl.app",
      "adaptiveIcon": {
        "backgroundColor": "#E8401C"
      },
      "permissions": ["NOTIFICATIONS", "RECEIVE_BOOT_COMPLETED"]
    },
    "plugins": [
      "expo-router",
      "expo-font",
      "expo-secure-store",
      ["expo-notifications", { "color": "#E8401C" }],
      ["expo-updates", { "username": "gbtl" }]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

---

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
      ProductGrid.tsx          ← FlatList 2-col with stagger animation
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
  hooks/
    useProducts.ts
    useProduct.ts
    useCart.ts
    useWishlist.ts
    useAuth.ts
    useBottomSheet.ts
  store/
    cartStore.ts
    wishlistStore.ts
    authStore.ts
  services/
    products.ts                ← Mock returning Promise (300ms delay)
    auth.ts                    ← Mock JWT flow
  lib/
    queryClient.ts
    secureStore.ts
    animations.ts              ← All Reanimated presets + animation tokens
  schemas/
    login.schema.ts
    checkout.schema.ts
  types/
    index.ts
  data/
    mockProducts.ts
  constants/
    tokens.ts                  ← mirrors tailwind tokens as TS consts
```

---

## DESIGN PATTERNS

### 1. Compound Component (Composition)
Use for complex multi-part UI. Pattern: named exports under a namespace.
```tsx
// Usage:
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

// Implementation: each sub-component is a named export on the namespace
const Root = ({ children, onPress }) => ...
const Image = ({ source }) => ...
ProductCard.Root = Root
ProductCard.Image = Image
// etc.
```
Apply to: ProductCard, ImageCarousel, Field (form), BottomSheet.

### 2. Slot Pattern (Button / Icon)
```tsx
// Button accepts any left/right icon via prop, not hardcoded
<Button variant="primary" leftIcon={<ShoppingCart size={18} />} fullWidth>
  Add to Cart
</Button>
```

### 3. Render Prop (ScreenWrapper scroll)
```tsx
<ScreenWrapper scrollable header={<Header title="Collection" />}>
  {({ scrollY }) => <ProductGrid animatedScrollY={scrollY} />}
</ScreenWrapper>
```

### 4. Custom Hook encapsulation
All business logic in hooks. Components only call hooks and render JSX.
```tsx
// WRONG: logic in component
const [items, setItems] = useState([])
useEffect(() => fetch('/products').then(...), [])

// RIGHT: logic in hook
const { products, isLoading, error } = useProducts(category)
```

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
Map each variant to the exact fontSize/lineHeight/letterSpacing from tailwind.config.
Never use raw `<Text>` anywhere in the codebase.

---

## ANIMATION SYSTEM

### Animation tokens (src/lib/animations.ts)
```ts
export const Duration = { fast: 150, base: 250, slow: 400, lazy: 600 } as const
export const Easing = {
  standard:   ReanimatedEasing.bezier(0.4, 0.0, 0.2, 1),
  decelerate: ReanimatedEasing.bezier(0.0, 0.0, 0.2, 1),
  accelerate: ReanimatedEasing.bezier(0.4, 0.0, 1, 1),
} as const
export const Spring = { gentle: { damping: 15, stiffness: 150 },
                        snappy: { damping: 12, stiffness: 200 } } as const
```

### Required animation presets (all must be implemented as hooks)
```ts
useFadeInUp(delay?: number)       // opacity 0→1, translateY 20→0
useScaleIn(delay?: number)        // scale 0.92→1, opacity 0→1
useSlideInRight()                 // translateX 40→0, opacity 0→1
useStagger(count, baseDelay)      // returns array of staggered styles
usePressScale(scale?: number)     // scale on Pressable press (withSpring)
useCartBounce()                   // scale 1→1.3→1 when item added to cart
useShimmer()                      // Skeleton loading shimmer (looping)
useParallax(scrollY, factor)      // hero image parallax on scroll
```

### Apply animations to:
- ProductCard.Root → `useFadeInUp` with stagger index × 80ms
- ProductGrid items → `useStagger` across all visible cards
- Add to Cart button → `usePressScale(0.95)` + ripple on press
- Cart badge count → `useCartBounce` when store item count changes
- Hero banner image → `useParallax` tied to HomeScreen scroll
- Screen mount transitions → `useSlideInRight` on stack navigation
- Skeleton loaders → `useShimmer` on product grid while loading
- ImageCarousel → gesture-handler pan + Reanimated spring snap
- Bottom tab icons → `useScaleIn` on active tab change
- Category chip selection → `usePressScale` + background color transition

---

## TYPES (src/types/index.ts)

```ts
export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  colors: ProductColor[]
  sizes: ProductSize[]
  category: 'men' | 'women' | 'kids'
  description: string
  rating: number
  reviewCount: number
  isFeatured?: boolean
  isNew?: boolean
  isSale?: boolean
}

export interface ProductColor {
  hex: string
  name: string
}

export interface ProductSize {
  label: string          // XS S M L XL
  available: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  selectedSize: string
  selectedColor: ProductColor
}

export interface AuthUser {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

export type RootStackParamList = {
  '(tabs)': undefined
  '(auth)/login': undefined
  'product/[id]': { id: string }
}
```

---

## STORES

### cartStore.ts (Zustand)
```ts
interface CartStore {
  items: CartItem[]
  addItem: (product: Product, size: string, color: ProductColor) => void
  removeItem: (productId: string, size: string, colorHex: string) => void
  updateQuantity: (productId: string, size: string, colorHex: string, qty: number) => void
  clearCart: () => void
  // Computed (use selectors, not state)
  // totalItems, subtotal, deliveryFee, total — implement as selectors
}
```

### authStore.ts (Zustand — token ONLY in SecureStore, never in state)
```ts
interface AuthStore {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: AuthUser) => void
  clearUser: () => void
}
// On app start: read token from SecureStore → if valid → setUser
// Token is only in SecureStore, never in Zustand state
```

---

## FORMS

### LoginForm — react-hook-form + zod
```ts
// schema: email (valid email), password (min 6)
// On submit: call authService.login() → store user → router.replace('/(tabs)/')
// Show field-level errors below each input
// Loading state on submit button
// "Forgot password?" link (navigates nowhere — placeholder)
```

### CheckoutForm — inside @gorhom/bottom-sheet
```ts
// schema: fullName (min 2), address (min 5), city (min 2),
//         cardNumber (16 digits), expiry (MM/YY regex), cvv (3 digits)
// Triggered from Cart screen "Checkout" button
// On submit: clear cart → show success toast → close sheet
```

---

## SCREENS

### app/_layout.tsx (Root)
```tsx
import 'react-native-gesture-handler'  // line 1 — mandatory
// Providers: GestureHandlerRootView → QueryClientProvider → BottomSheetModalProvider → Stack
// expo-splash-screen: hide after fonts + data ready
// expo-status-bar: style="auto"
// On mount: check SecureStore for token → restore session if valid
```

### app/(tabs)/index.tsx — Home
- Animated hero banner: full-width expo-image + `useParallax` + Typography display "YOUR VISION YOUR STYLE" + Button primary "Explore Collection"
- Category chips (All / Men / Women / Kids): horizontal FlatList, Reanimated color transition on select
- ProductGrid: `useProducts(category)` → Skeleton while loading → staggered card animation on load
- Pull-to-refresh via TanStack Query refetch

### app/(tabs)/collection.tsx — Collection
- Header with title + filter icon
- Sort bar (Relevance / Price: low–high / Newest) — state in filterStore or local useState
- ProductGrid: `useProducts()` filtered + sorted client-side
- Empty state if no results

### app/product/[id].tsx — ProductDetail
- `useProduct(id)` — Skeleton while loading
- ImageCarousel: gesture swipe + snap, thumbnails row, `useSlideInRight` on mount
- Typography heading1 for name, Typography price for price (strike-through if sale)
- ColorSwatch: animated border on select, color name label
- SizeSelector: animated background fill on select, disabled style for unavailable sizes
- Description text with "Read more" expand (Reanimated height animation)
- Add to Cart: `usePressScale` + `useCartBounce` triggers in cartStore → navigate to cart or stay
- Wishlist heart icon: filled/unfilled with spring scale animation

### app/(tabs)/cart.tsx — Cart
- CartItem list with swipe-to-delete (gesture-handler)
- Quantity controls (−/+) with optimistic update
- CartSummary: subtotal, delivery $16.00, total
- "Checkout" button opens CheckoutForm in @gorhom/bottom-sheet
- Empty state: EmptyState component with bag icon + CTA to collection

### app/(tabs)/profile.tsx — Profile
- Avatar circle with initials (animated scale-in on mount)
- User name + email from authStore
- Menu list: Orders (placeholder), Wishlist, Settings (placeholder), Logout
- Logout: clearUser() + deleteToken() + router.replace('/(auth)/login')

### app/(auth)/login.tsx — Login
- GBTL logo + tagline
- LoginForm
- Redirect to /(tabs)/ on success

---

## CROSS-PLATFORM RULES

```
KeyboardAvoidingView:
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}

Bottom tab bar:
  iOS: BlurView from expo-blur (intensity=80, tint="light")
  Android: solid surface color (#FFFFFF)
  Detect with Platform.OS

Safe area:
  ScreenWrapper uses useSafeAreaInsets() for top/bottom padding
  Never hardcode padding for device edges

Shadows:
  iOS: shadowColor, shadowOffset, shadowOpacity, shadowRadius
  Android: elevation
  Always define both in every shadow style

Fonts:
  System default only — SF Pro (iOS), Roboto (Android)
  No expo-font loading required unless custom font added later

Back navigation:
  iOS: swipe right (Expo Router native stack handles it)
  Android: hardware back button (Expo Router handles it)
  Do not implement custom back handling

Status bar:
  expo-status-bar with style="auto" in root layout
  No manual StatusBar from react-native

Notifications permission:
  Request on Profile screen mount using expo-notifications
  Handle both granted and denied gracefully
```

---

## MOCK DATA (src/data/mockProducts.ts)

12 products (4 per category: men, women, kids).
Images: `https://picsum.photos/seed/{productId}/400/500`
Each product: 3 ProductColor objects (hex + name), all 5 sizes with available:true except 1 random unavailable, price $80–$280, rating 3.5–5.0, reviewCount 10–500.
Add isSale:true on 3 products with originalPrice set.
Add isNew:true on 3 products.

`src/services/products.ts`: returns mock data in a Promise with 300ms setTimeout.
`src/services/auth.ts`: returns `{ user: { id:'1', name:'Tavorian', email:'tavorian@gbtl.com' }, token: 'mock.jwt.eyJ...' }` in a 500ms Promise.

---

## COMPONENT LOADING STATES

Every screen that fetches data must implement:
1. Skeleton state (isLoading) — use `<Skeleton>` component with shimmer animation
2. Error state (isError) — use `<EmptyState>` with retry button that calls `refetch()`
3. Empty state (data = []) — use `<EmptyState>` with relevant message

Skeleton for ProductGrid: render 6 `<Skeleton>` cards in the same 2-column layout.
Skeleton for ProductDetail: image placeholder + 3 text lines.

---

## ERROR BOUNDARY

Create `src/components/layout/ErrorBoundary.tsx` as a class component.
Wrap root Stack in app/_layout.tsx with it.
Show a minimal error screen with "Something went wrong" + reload button.

---

## BUILD SYSTEM
This spec is consumed by the wave-based multi-agent build system in tasks/.
Generation order and parallelism are managed by the orchestrator — see tasks/status.md.
Each file must be complete: no stubs, no TODOs, no placeholder returns.
First line of every generated file must be a comment with the exact file path.
