# GBTL — Redesign Trendora v2 (Wave 7)

Six targeted refinements after the wave-6 redesign to bring the UI closer to the Trendora reference.

## What's wrong today (vs reference)

1. **TabBar** is a full-width blur strip; reference is a floating white pill with an active-dot indicator.
2. **Home top row** has avatar + "GBTL" stacked together on the left and a circular cart pill on the right; reference has avatar left, **brand centered**, **bare cart icon** with badge on right.
3. **ColorSwatch** on product detail always renders its color-name label underneath; reference shows just inline circles.
4. **Add to Cart / Buy Now** buttons use `rounded-btn` (10px); reference uses full pill rounding.
5. **ProductCard** renders the wishlist heart in its footer; reference floats it as a small white chip at the top-right corner of the product image.
6. **Collection** sort pills use `bg-accent` when active; should use `bg-primary` to match the new visual system (accent is reserved for hearts and small badges).

## File-level changes

### MODIFY `src/components/layout/TabBar.tsx`

Drop the BlurView and full-width chrome. Render the tab row as a **floating pill** anchored to the bottom safe area:

- Outer wrapper: absolute bottom-0 left-0 right-0 with `paddingBottom: insets.bottom + 8` and `paddingHorizontal: 16` so the pill floats above the screen edge.
- Inner: `bg-surface rounded-pill flex-row` with a strong shadow (iOS: shadowColor=Colors.primary, offset {0,4}, opacity 0.12, radius 12; Android: elevation 8). Height ~64.
- Each `TabItem` is a `Pressable flex-1 items-center justify-center` containing:
  - Icon (existing logic — keep cart badge)
  - **Active indicator dot**: a 5px `bg-primary rounded-full` 3px below the icon, only visible when `isFocused` (use Animated.View with opacity withTiming for crossfade).
  - Drop the text label (reference has icon-only tabs)
- Active icon color: `Colors.primary`. Inactive: `Colors.muted`. (No more accent on tabs.)

Removed: `Typography` import & label per tab, the BlurView import (or guard it behind nothing — just delete it). Keep the press scale animation. The component returns a single absolute View.

### MODIFY `app/(tabs)/index.tsx`

Restructure the top row only — keep everything below the brand row (greeting, search, pills, grid) identical.

New top row (replace the current `<View ... flex-row items-center justify-between>` block at the top):

```
[Avatar 36x36]   [GBTL — centered, heading3 bold]   [ShoppingBag icon + badge]
```

- Use `flex-row items-center` with three children:
  1. Left avatar (existing Pressable to profile, same 36x36 circle and initials fallback)
  2. Middle wrapper: `<View className="flex-1 items-center">` with `<Typography variant="heading3" weight="bold">GBTL</Typography>`
  3. Right: Pressable WITHOUT the rounded surface background — just the `ShoppingBag` icon size 22 color `Colors.primary` with the Badge overlapping (use hitSlop for tap area)
- The right Pressable keeps the press scale.

Also bump the grid to a 1-line bottom safe-area buffer so it doesn't get covered by the new floating tab pill: add `paddingBottom: insets.bottom + 72` to the ProductGrid wrapper via its `contentContainerStyle`... wait, ProductGrid manages its own contentContainerStyle. Instead, wrap the grid in a `<View className="flex-1" style={{ marginBottom: 0 }}>` and trust ProductGrid's existing `Spacing.xl` bottom pad — combined with the floating tab pill the visual padding will look right. **No change needed to ProductGrid**; the new floating TabBar overlays the screen so its 64px height needs to be accounted for.

To keep it simple, add at the wrapper level: `style={{ paddingBottom: 96 }}` on the View containing ProductGrid. This keeps the last grid items visible above the floating pill.

### MODIFY `src/components/product/ColorSwatch.tsx`

Add a new optional prop `hideLabel?: boolean` (default `false`). When true, do not render the "Currently: {selected.name}" Typography line. Existing callers without the prop continue to see the label.

### MODIFY `app/product/[id].tsx`

Two small visual changes:

1. Pass `hideLabel` to ColorSwatch in the info card:
   ```tsx
   <ColorSwatch colors={product.colors} selected={selectedColor} onSelect={setSelectedColor} hideLabel />
   ```
2. The two footer buttons currently use the default rounded-btn. Wrap them so the visual is a pill. The cleanest fix: add a new optional `rounded?: 'btn' | 'pill'` prop to `Button` (default `'btn'`) — see Button task below.

After Button supports `rounded='pill'`, change the footer:
```tsx
<Button variant="outline" fullWidth rounded="pill" onPress={handleAddToCart}>Add to Cart</Button>
<Button variant="primary" fullWidth rounded="pill" onPress={handleBuyNow}>Buy Now</Button>
```

### MODIFY `src/components/ui/Button.tsx`

Add an optional `rounded?: 'btn' | 'pill'` prop (default `'btn'`). When `'pill'`, the container className uses `rounded-pill` instead of `rounded-btn`. The size map already controls height/padding — only the border-radius classname changes.

```ts
const CONTAINER_SIZE: Record<Size, string> = {
  sm: 'h-9 px-3',
  md: 'h-12 px-5',
  lg: 'h-14 px-6',
}
```

Then assemble: `[CONTAINER_VARIANT[variant], CONTAINER_SIZE[size], rounded === 'pill' ? 'rounded-pill' : 'rounded-btn']`.

Backwards compatible — existing callers without `rounded` get `rounded-btn` exactly like today.

### MODIFY `src/components/product/ProductCard/index.tsx`

Move the wishlist heart from the footer to an absolute chip on the image:

- Inside `CardImage` (which already returns a `<View className="relative">`), add the wishlist button as an absolute child positioned `top-2 right-2`:
  - Wrap the existing `WishlistButton` body (Pressable + animated Heart) in `<View className="absolute top-2 right-2 bg-surface w-8 h-8 rounded-full items-center justify-center" style={{ shadow... + elevation }}>`.
- Remove the now-unused `Footer` + `WishlistButton` calls from `ProductGrid.tsx` (next change).

Easier approach that keeps the compound API intact: introduce a new sub-component `WishlistChip` that renders the chip variant. Keep `Footer` and `WishlistButton` exports unchanged for back-compat. Then in `ProductGrid.tsx`, swap `<ProductCard.Footer><ProductCard.WishlistButton/></ProductCard.Footer>` for `<ProductCard.WishlistChip />` placed inside `<ProductCard.Image>` is not possible since Image is self-closing.

Simplest path: render the chip inside CardImage when a context flag is set; OR drop the footer slot from ProductGrid and render the chip inside the Image component directly. Choose the latter — modify `CardImage` to always render the chip in its top-right, and remove `ProductCard.Footer` from the ProductGrid composition.

Concretely:
- In `CardImage`: add the chip JSX as an absolute child at `top-2 right-2`. The chip is a 32x32 `bg-surface rounded-full items-center justify-center` with light shadow. Inside it, the existing useWishlist + Heart icon + useCartBounce animation logic (move the WishlistButton body code into this chip — extract a private `WishlistChipInner` if needed to keep hooks at top level).
- The exported `WishlistButton` and `Footer` sub-components stay defined but unused going forward.

### MODIFY `src/components/product/ProductGrid.tsx`

Remove the now-redundant `<ProductCard.Footer>` + `<ProductCard.WishlistButton>` from the renderItem since the chip is in CardImage. New body:

```tsx
<ProductCard.Root product={item} staggerIndex={index} onPress={...}>
  <ProductCard.Image />
  <ProductCard.Body>
    <ProductCard.Name />
    <ProductCard.Price />
  </ProductCard.Body>
</ProductCard.Root>
```

Also raise contentContainerStyle paddingBottom from `Spacing.xl` to ~120 so items aren't hidden under the floating tab pill.

### MODIFY `app/(tabs)/collection.tsx`

Change the active sort pill from `bg-accent border-accent` to `bg-primary border-primary` so it matches the new design language (accent is reserved for hearts and small badges). The inactive style stays the same. Active text color stays `white`.

## Hard rules (re-stated)

- Never raw `<Text>` — Typography only
- Never hardcoded hex outside ColorSwatch.tsx, tokens.ts, tailwind.config.js, global.css, app.json
- Reanimated only (no `Animated` from react-native)
- Shadows must include both iOS (shadowColor etc) and Android (elevation)
- `useSafeAreaInsets()` for device-edge padding
- TanStack Query v5: `isPending`, object syntax
- Max 150 lines per screen file

## Out of scope (don't touch)

- Auth screens (login.tsx is acceptable as-is for now)
- Profile screen (already aligned)
- Cart screen (wave 6 changes were sufficient)
- Stores, hooks, services, schemas, types, mockProducts, tokens, tailwind config
- BadgesScale, Typography, ScreenWrapper, Header (wave 6 already covered these)
