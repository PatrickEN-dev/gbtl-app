# GBTL — Redesign Trendora v3 (Wave 9)

Combines visual fidelity fixes (1-column featured grid, frosted-glass tab bar, larger photos) with a **primitives layer** so the same repeated UI shapes (cards, pills, icon buttons) are defined ONCE and consumed by composition. Senior-team architecture.

## Why this wave

After waves 6-8 the visual is close but still misses three things vs the Trendora reference:

1. **Trending grid is 2 columns**, reference shows **1 large featured card per row**.
2. **Tab bar is a solid white pill**, reference has a **frosted-glass / blurred translucent** pill.
3. **Product cards are too small** — the featured layout needs a bigger image (full-width, 4:5 aspect) with a richer footer.

Also: the codebase is repeating the same shapes (white card + shadow, dark pill, rounded surface icon button) in 5-10 places each. Extracting **3 primitives** removes the duplication AND makes future iterations cheap (change one file, all consumers update).

## Primitives layer (NEW)

All under `src/components/primitives/`. Each exports its component as default. Each is **pure presentational** — no business logic, no hooks beyond press animations.

### `src/components/primitives/Card.tsx`

Compound: `Card.Root` / `Card.Body` / `Card.Header` / `Card.Footer`.

`Card.Root` props:
```ts
interface CardRootProps {
  variant?: 'surface' | 'elevated' | 'flat'   // default 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'        // default 'md'
  rounded?: 'card' | 'pill' | 'lg' | 'none'    // default 'card'
  className?: string
  style?: ViewStyle
  children: React.ReactNode
}
```

- `surface` = `bg-surface` (no shadow)
- `elevated` = `bg-surface` + iOS shadow (color Colors.primary, offset {0,2}, opacity 0.06, radius 8) + Android elevation 2
- `flat` = transparent bg

Padding map: none=0, sm=p-2, md=p-4, lg=p-6.

`Card.Body` = `<View className={`gap-${gap}`}>` with `gap?: 'sm' | 'md' | 'lg'` default `md`.
`Card.Header` = `<View className="flex-row items-center justify-between mb-3">`.
`Card.Footer` = `<View className="flex-row items-center justify-end gap-2 mt-3">`.

Replaces these repeated patterns:
- CartItem outer card
- CartSummary outer card
- ProductCard outer card
- Cart screen "My Cart" summary card
- Product detail image card + info card

### `src/components/primitives/Pill.tsx`

Single component (no compound).

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

Internally renders:
- Outer: Pressable wrapped in `Animated.View` with `usePressScale(0.95)`
- Container className: `rounded-pill flex-row items-center justify-center` + variant/tone/size mappings
- Children typed: if string, wraps in `<Typography variant="body-sm" weight="semibold" color={textColor}>`; else renders raw

Size map:
- sm: h-7 px-3 gap-1
- md: h-9 px-4 gap-1.5
- lg: h-11 px-5 gap-2

Variant×tone map (selected combos):
- solid+primary: `bg-primary` text=white
- solid+accent: `bg-accent` text=white
- solid+surface: `bg-surface border border-border` text=primary
- outline+primary: `border border-primary bg-transparent` text=primary
- ghost+primary: `bg-transparent` text=primary

Replaces:
- SearchBar "Filter" inner pill
- Category chips (Trending/Shows/Bag/Shirts)
- Cart "Add to Checkout" pill
- CartItem price pill
- Detail page color name chips (future)
- Profile menu CTAs (future)

### `src/components/primitives/IconButton.tsx`

```ts
interface IconButtonProps {
  icon: React.ReactNode           // a lucide icon JSX, sized by caller
  onPress?: () => void
  variant?: 'surface' | 'ghost' | 'primary'  // default 'surface'
  size?: 'sm' | 'md' | 'lg'                  // default 'md' (40x40)
  badge?: number                  // shows a Badge overlay (top-right) when > 0
  className?: string
  accessibilityLabel?: string
}
```

Size map: sm=32, md=40, lg=48 (square).

Variant map:
- surface: `bg-surface border border-border` + light shadow
- ghost: `bg-transparent`
- primary: `bg-primary`

Internally: Pressable in Animated.View with `usePressScale(0.9)`, rounded-full, centered icon, optional Badge overlay using existing Badge.

Replaces:
- Header rounded back/heart buttons (the `RoundedSlot` helper goes away)
- Home top-row cart icon
- CartItem X close button
- ProductCard wishlist chip (still has wishlist logic inside — see refactor)

## Visual fidelity changes

### 1. ProductGrid featured layout

Add `variant?: 'grid' | 'featured'` to `ProductGrid` (default `'grid'` so existing callers don't break).

When `featured`:
- `numColumns={1}`
- Each item is the new `<ProductCard.FeaturedLayout>` (see below)
- contentContainerStyle paddingBottom: 140 (room above tab bar)
- columnWrapperStyle removed (only valid with numColumns > 1)
- gap between rows: 16

### 2. ProductCard featured layout

Add a new compound sub-component `ProductCard.FeaturedLayout` that internally lays out:
- Image (full width, aspectRatio 4:5)
- Bottom strip: name on left + "Price" tiny label above price on the right

In the grid layout case, ProductGrid composes:
```tsx
<ProductCard.Root product={item} onPress={...}>
  <ProductCard.FeaturedLayout />
</ProductCard.Root>
```

The existing slots (Image, Body, Name, Price, Footer, WishlistButton) stay for back-compat. FeaturedLayout uses them internally.

Inside FeaturedLayout the footer row is:
```tsx
<View className="flex-row items-end justify-between px-4 py-3">
  <Typography variant="heading3" className="flex-1 mr-3">{name}</Typography>
  <View className="items-end">
    <Typography variant="caption" color="muted">Price</Typography>
    <Typography variant="price">${price}</Typography>
  </View>
</View>
```

Wishlist heart chip still appears at top-right of image (no change to existing logic — keep WishlistChip rendering inside CardImage).

### 3. TabBar frosted-glass blur

Wrap the inner pill in `<BlurView intensity={70} tint="light" experimentalBlurMethod="dimezisBlurView">`. Apply `overflow: hidden` to the outer wrapper so the BlurView is clipped to the rounded-pill shape.

The BlurView replaces the solid `bg-surface` on the inner pill. Background becomes semi-transparent: use NO `bg-surface` class but DO add a subtle fallback (`backgroundColor: 'rgba(255,255,255,0.7)'` via style) so on Android web fallback the pill still has structure.

Active dot indicator and icon logic stay identical (Colors.primary on focus, Colors.muted off).

## Consumer refactors

### `src/components/cart/CartItem.tsx`
Replace outer `<View className="flex-row bg-surface rounded-2xl p-3 mb-3" style={shadowStyle}>` with `<Card.Root variant="elevated" padding="sm" rounded="card" className="flex-row mb-3 relative">`. Replace the price pill `<View className="bg-primary rounded-pill ...">` with `<Pill variant="solid" tone="primary" size="sm">${price}</Pill>`. Replace the X close `<Pressable ...>` with `<IconButton icon={<X size={14} ... />} variant="surface" size="sm" />` (positioned absolute top-2 right-2).

### `src/components/cart/CartSummary.tsx`
Replace outer `<View ...>` with `<Card.Root variant="elevated" padding="md" rounded="card">`. Keep all internal SummaryRow + Separator logic.

### `src/components/layout/Header.tsx`
Replace the internal `RoundedSlot` helper + back-button JSX with `<IconButton icon={<ChevronLeft .../>} variant="surface" />` and equivalent for the right-side. Remove the local shadow constant — IconButton owns its shadow.

### `src/components/ui/SearchBar.tsx`
Replace the right-side filter `<Animated.View style={animatedStyle}><Pressable className="rounded-pill bg-primary ...">...</Pressable></Animated.View>` with `<Pill variant="solid" tone="primary" size="md" leftIcon={<SlidersHorizontal size={14} color={Colors.surface}/>} onPress={onFilterPress}>Filter</Pill>`.

### `app/(tabs)/index.tsx`
- Replace the right cart `<Animated.View><Pressable ...><ShoppingBag... /></Pressable></Animated.View>` with `<IconButton icon={<ShoppingBag size={20} color={...}/>} variant="ghost" size="md" badge={totalItems} onPress={...} />`.
- Replace each category chip animation block with `<Pill variant={isActive ? 'solid' : 'ghost'} tone="primary" size="sm" onPress={...}>{label}</Pill>` (drop the local interpolateColor logic; Pill handles styling). Wrap in a horizontal FlatList for scroll.
- Pass `variant="featured"` to `<ProductGrid ... />`.

### `app/(tabs)/cart.tsx`
Replace the "My Cart" summary card View block with `<Card.Root variant="elevated" padding="md" className="mx-4 mt-4 mb-2 flex-row items-center justify-between"><Typography ...>My Cart</Typography><Pill ... onPress={handleCheckout}>Add to Checkout</Pill></Card.Root>`.

### `app/product/[id].tsx`
Replace the image card and info card outer Views with `<Card.Root variant="elevated" padding="sm" className="mx-4 mt-3">` and `<Card.Root ... padding="md" className="mx-4 mt-3">` respectively. Drop the local `shadow` constant.

## Out of scope (don't touch)

- Stores, hooks, services, schemas, types, mockProducts
- Auth/login, profile, collection screens
- ImageCarousel, ColorSwatch, SizeSelector, QuantityStepper, Button, Typography, Badge, Skeleton, EmptyState, Divider
- Tailwind config, global.css, tokens.ts (already updated in wave 8)

## Hard rules (re-stated)

- Never raw `<Text>` — Typography only
- Never hardcoded hex outside ColorSwatch.tsx, tokens.ts, tailwind.config.js, global.css, app.json
- Reanimated only (no `Animated` from react-native)
- Shadows must include both iOS (shadowColor etc) and Android (elevation)
- `useSafeAreaInsets()` for device-edge padding
- TanStack Query v5: `isPending`, object syntax
- Max 150 lines per screen file
- All theme colors via `bg-X / text-X / border-X` tokens — they auto-swap in dark mode via CSS vars
- For JS-side colors (lucide `color={}`, RN shadows), use `useThemeColors()` from `@/hooks/useThemeColors` instead of importing `Colors` directly

## Architecture rule (new)

When a UI shape repeats in **3+ places** (rounded surface card with shadow, dark pill with text, rounded surface icon button), it MUST live in `src/components/primitives/`. Consumers compose primitives — they don't redeclare the shape.