# Wave 7 / Task — ProductCard wishlist chip overlay

## Spec source
Read `sdd/specs/redesign-trendora-v2.md` — "ProductCard/index.tsx" + "ProductGrid.tsx" subsections.
Read the existing files first:
- `src/components/product/ProductCard/index.tsx`
- `src/components/product/ProductGrid.tsx`

## Files to modify

1. `src/components/product/ProductCard/index.tsx`
2. `src/components/product/ProductGrid.tsx`

## ProductCard changes

Goal: render the wishlist heart as a small floating **chip** on the top-right of the product image — not inside the footer.

Concrete steps:

1. Refactor `CardImage` so that inside its `<View className="relative">`, alongside the `<Image>` and the badge column, it now ALSO renders a wishlist chip at `top-2 right-2`. The chip:
   - 32x32 `bg-surface rounded-full items-center justify-center`
   - Light shadow (iOS: shadowColor=Colors.primary, offset {0,1}, opacity 0.08, radius 4; Android: elevation 2)
   - Inside: an Animated.View with `useCartBounce` press scale (existing `WishlistButton` logic) wrapping a `<Heart size={16} color={...} fill={...} />`
   - Pressable triggers `useWishlist().toggle(product.id)` + `useCartBounce.trigger()` exactly like current `WishlistButton`
   - Use `hitSlop` for the Pressable so it remains tappable

   To keep React hook rules valid (no hooks in conditionals), extract a tiny `<WishlistChip />` private component that does the hook calls and returns the chip JSX. Render it absolutely positioned inside CardImage.

2. Keep the existing exports `Footer` and `WishlistButton` for back-compat — DON'T delete them. Just stop rendering them in the grid (see next file).

## ProductGrid changes

The current renderItem composition includes `<ProductCard.Footer><ProductCard.WishlistButton /></ProductCard.Footer>`. Remove that — leave only:

```tsx
<ProductCard.Root product={item} staggerIndex={index} onPress={...}>
  <ProductCard.Image />
  <ProductCard.Body>
    <ProductCard.Name />
    <ProductCard.Price />
  </ProductCard.Body>
</ProductCard.Root>
```

Also: raise the bottom content padding so items aren't covered by the new floating tab pill. In `contentContainerStyle`, change `paddingBottom: Spacing.xl` to `paddingBottom: 120`.

## Hard rules

- No raw `<Text>`
- No hex colors
- Reanimated only
- Both iOS shadow + Android elevation on the new chip
- File ProductCard/index.tsx should stay ≤230 lines

## Acceptance

- `npx tsc --noEmit` clean
- Each product card in the grid shows a heart icon in a small white circle at the TOP-RIGHT of the product image
- Tapping the heart toggles wishlist and bounces (existing animation)
- The price + name area is no longer cluttered by a footer slot
- Last row of products is fully visible above the floating tab pill
