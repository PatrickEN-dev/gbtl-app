# GBTL — Redesign Trendora (Wave 6)

Refresh the visual language of three screens (Home, Product Detail, Cart) and add 2 small UI atoms so the app matches a Trendora-style fashion reference.

## Visual direction

- Heavy use of white surface cards over the `bg` background (#F5F5F5).
- Rounded `pill`/`btn` everywhere; primary CTAs are dark filled (`bg-primary` for buttons, `bg-accent` reserved for orange highlights).
- Soft cards: 16px radius, light shadow (`shadowOpacity: 0.06`, `elevation: 2`).
- Header on detail/cart screens: rounded icon buttons (40px circle) on white surface — not the transparent-on-image style.
- Tab bar stays floating blur (already implemented).

## Brand additions (no new colors)

Re-uses the existing `tokens.ts` palette. The reference uses dark pills for active state — we render those with `bg-primary` (`#111111`) and white text. Accent (`#E8401C`) is reserved for the wishlist heart and small badges only.

## NEW components (atoms)

### `src/components/ui/SearchBar.tsx`

Pill-shaped input with leading magnifying-glass icon and a trailing dark-pill "Filter" button.

Props:
```ts
interface SearchBarProps {
  value: string
  onChangeText: (v: string) => void
  onFilterPress?: () => void
  placeholder?: string
}
```

Layout:
- Outer `bg-surface rounded-pill` row with `border border-border`, height 48
- Left: `Search` icon (lucide), size 18, `Colors.muted`, padded 16px
- Middle: `TextInput` with `placeholderTextColor={Colors.muted}` and Typography body styling
- Right: Pressable rounded-pill `bg-primary h-9 px-4` with `SlidersHorizontal` icon + Typography body-sm color="white" "Filter"
- usePressScale on the Filter button

### `src/components/ui/QuantityStepper.tsx`

Compact `- count +` row used on the product detail page next to the title.

Props:
```ts
interface QuantityStepperProps {
  value: number
  onChange: (n: number) => void
  min?: number          // default 1
  max?: number          // default 99
}
```

Layout:
- Row, gap 8
- Minus button: 32x32 rounded-full `bg-surface border border-border` (disabled at min via opacity-40)
- Count: Typography body weight=semibold, 2-digit zero-padded (`01`, `02`)
- Plus button: 32x32 rounded-full `bg-primary`, icon white

Both buttons use `usePressScale(0.9)`. Behaviour: clamp to [min, max].

## MODIFIED files

### `src/components/layout/Header.tsx`

Add a `roundedIcons` prop. When true, render the back button as a 40x40 `bg-surface rounded-full` circle (still `Colors.primary` icon) and accept `rightElement` that the screen can wrap the same way. Add a subtle shadow on the rounded buttons.

Backwards compatible — existing callers without `roundedIcons` get the current rendering.

### `src/components/cart/CartItem.tsx`

Two refinements to match the reference card style — keep the existing API and swipe-to-delete:

1. Add an X close button (lucide `X`, size 14, `Colors.muted`) at the **top-right** of the row that calls `onRemove` directly (so users without swipe gestures can still delete).
2. Replace the right-column "$199.00" Typography with a small dark **price pill**: `bg-primary rounded-pill px-3 py-1.5` with Typography body-sm color="white".

Layout becomes: image | name/size/color stacked + qty controls below | column with X (top) and price pill (bottom).

## REWRITTEN screens

### `app/(tabs)/index.tsx` (Home — ≤150 lines)

Replace the parallax hero with a Trendora-style top block.

Structure (top to bottom, all inside `ScreenWrapper` or a `View bg-bg`):

1. **Profile row** (px-4, mt = insets.top + 8, mb 4):
   - Pressable circle 36x36 with `expo-image` of `user?.avatarUrl` OR initials chip (re-use the initials helper pattern from profile.tsx) → `router.push('/(tabs)/profile')`
   - Typography heading3 "GBTL" weight=bold to the right of avatar
   - Spacer
   - Pressable rounded-pill `bg-surface border border-border h-10 w-10 items-center justify-center` containing `ShoppingBag` icon with Badge cart count (re-using existing pattern) → `router.push('/(tabs)/cart')`

2. **Greeting** (px-4, mb-1):
   - Typography heading1 `Hello ${user?.name?.split(' ')[0] ?? 'there'}`
   - Typography body-sm color="muted" "Fashion confidence and reveals beauty."

3. **SearchBar** (px-4, my-4):
   - State: `const [query, setQuery] = useState('')`
   - `onFilterPress` no-op for now

4. **Category pills** (px-4, mb-3):
   - `['Trending', 'Shows', 'Bag', 'Shirts']` mapped to existing category logic
   - Active pill: `bg-primary` text-white; inactive: transparent text-primary (no border)
   - Use `withTiming(Duration.fast)` for the bg crossfade
   - Map UI labels to API categories: Trending→undefined (all), Shows→'women', Bag→'men', Shirts→'kids' (fashion-store flexibility)

5. **ProductGrid** (existing — pass active category)

Keep `useProducts(category)` + skeleton/error/empty handling intact (already inside ProductGrid).

Remove the absolute transparent header overlay and the parallax hero entirely.

### `app/product/[id].tsx` (Product Detail — ≤150 lines)

Restructure to the reference layout.

Header: `<Header showBack roundedIcons rightElement={<RoundedIcon><Heart .../></RoundedIcon>} title="Details" />` — when `roundedIcons` true, Header itself centers the title and renders the back button as a circle. Place over the `bg-bg` background (no transparent prop).

Hero block (white surface card with `rounded-card`, mx-4, mt-2):
- Layout: row with left = main image flex-1 (aspectRatio 1) and right = vertical thumbnails strip (width 64).
- Reuse `ImageCarousel.Root` + Slide. Add a new compound `ImageCarousel.SideThumbnails` to render the vertical column (see Carousel update below).

Info block (white surface card, mx-4, mt-3, p-4, rounded-card):
- Row: Typography heading2 (product.name, flex-1) + `<QuantityStepper value={qty} onChange={setQty} />`
- Row mt-3: `<Typography variant="body" color="muted">From: </Typography><Typography variant="price">$X</Typography>` flex-1, then inline `<ColorSwatch ... />` on the right (allow ColorSwatch container to be a row without label below).

Size block (mx-4, mt-3):
- Typography heading3 "Select Size" mb-2
- `<SizeSelector ... />`

Description block (mx-4, mt-3, mb-32):
- Typography heading3 "Description" mb-2
- Typography body color="muted" (existing read-more interaction preserved)

Footer (absolute bottom, bg-surface, px-4, pt-3, paddingBottom: insets.bottom + 12):
- Row gap-3:
  - `<Button variant="outline" fullWidth onPress={handleAddToCart}>Add to Cart</Button>` (flex-1)
  - `<Button variant="primary" fullWidth onPress={handleBuyNow}>Buy Now</Button>` (flex-1)
  - Wrap each in a `<View className="flex-1">` since Button.fullWidth fills its parent.
- `handleBuyNow`: addItem + router.push('/(tabs)/cart')

Drop the `Badge` rating chip and the floating single-button at the bottom.

### `app/(tabs)/cart.tsx` (Cart — ≤150 lines)

Smaller tune-up to match the reference.

- Replace `<Header title="Cart" />` with `<Header title="My Cart" roundedIcons showBack={false} />` (no back when arriving via tabs — Header just renders the centered title and a right action).
- Above the FlatList (only when items.length > 0), render a row inside a white surface card (mx-4, p-4, rounded-card):
  - Typography heading3 "My Cart"
  - Spacer
  - Small dark pill button with `ShoppingBag` icon + "Add to Checkout" Typography body-sm color="white" — pressing it calls the existing `handleCheckout`.
- CartItem and CartSummary stay as-is (CartItem visual itself is updated separately).
- Move the bottom Checkout button to use `variant="primary"` `bg-primary` (we already do this through the Button primary; just ensure it sits inside a white surface footer card).

### `src/components/product/ImageCarousel/index.tsx`

Add a new sub-component `SideThumbnails` (vertical version of `Thumbnails`):

```tsx
function SideThumbnails() {
  const { images, activeIndex, setActiveIndex } = useCarouselContext()
  return (
    <View className="gap-2 pl-2">
      {images.slice(0, 4).map((uri, index) => (
        <Pressable key={index} onPress={() => setActiveIndex(index)}>
          <View
            className={`w-14 h-14 rounded-lg overflow-hidden ${
              index === activeIndex ? 'border-2 border-accent' : 'border border-border'
            }`}
          >
            <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          </View>
        </Pressable>
      ))}
    </View>
  )
}
```

Export under `ImageCarousel.SideThumbnails` alongside the existing exports.

Also: relax `Slide` to take an optional `aspectRatio` prop (default 1) so the product detail page can render a square instead of the fixed 400px height. Update the inline `style={{ width:'100%', height: 400 }}` to a square via `style={{ width: '100%', aspectRatio }}`.

## Out of scope (don't touch in this wave)

- Auth screens, profile screen, collection screen, +not-found
- TabBar, ScreenWrapper, ProductCard, ProductGrid (no API change needed)
- Stores, hooks, services, schemas
- mockProducts, tokens, tailwind config

## Mandatory rules (re-stated from CLAUDE.md)

- Never use raw `<Text>` — Typography only
- Never hardcode colors — NativeWind className. JS-side use `Colors.*` from tokens (e.g. `interpolateColor` args, lucide `color={}` props, RN shadow style)
- Shadows: both iOS (shadowColor etc) AND Android (elevation)
- Reanimated only — never `Animated` from `react-native`
- `useSafeAreaInsets()` for any device-edge padding
- TanStack Query v5: `isPending`, object syntax
- Max 150 lines per screen file