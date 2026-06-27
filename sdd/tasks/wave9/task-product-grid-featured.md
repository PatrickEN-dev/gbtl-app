# Wave 9 / Task — ProductGrid featured + ProductCard FeaturedLayout

## Spec source
Read `sdd/specs/redesign-trendora-v3.md` — "ProductGrid featured layout" and "ProductCard featured layout" subsections.

## Files to modify

1. `src/components/product/ProductCard/index.tsx`
2. `src/components/product/ProductGrid.tsx`

## Changes

### ProductCard/index.tsx

Add a new compound sub-component `FeaturedLayout` that lays out the card as a single 4:5 image with a footer strip below.

Inside the existing file (after the other sub-components, before the namespace export), add:

```tsx
function FeaturedLayout() {
  const { product } = useProductCardContext()
  return (
    <>
      {/* Image (full width, 4:5) with the WishlistChip already inside CardImage */}
      <CardImage />
      {/* Footer strip */}
      <View className="flex-row items-end justify-between px-4 py-3">
        <Typography variant="heading3" className="flex-1 mr-3" numberOfLines={2}>
          {product.name}
        </Typography>
        <View className="items-end">
          <Typography variant="caption" color="muted">Price</Typography>
          <Typography variant="price">${product.price.toFixed(2)}</Typography>
        </View>
      </View>
    </>
  )
}
```

Update CardImage to render the image at aspectRatio 4/5 (currently 3/4). Change:
```ts
style={{ width: "100%", aspectRatio: 3 / 4, borderRadius: 0 }}
```
to:
```ts
style={{ width: "100%", aspectRatio: 4 / 5, borderRadius: 0 }}
```

Update the `ProductCard` namespace export to include FeaturedLayout:
```ts
export const ProductCard = {
  Root,
  Image: CardImage,
  Body,
  Name,
  Price,
  Footer,
  WishlistButton,
  NewBadge,
  SaleBadge,
  FeaturedLayout,
}
```

### ProductGrid.tsx

Add a `variant?: 'grid' | 'featured'` prop (default `'grid'`).

```ts
interface ProductGridProps {
  products?: Product[]
  isPending: boolean
  isError: boolean
  refetch: () => unknown
  onProductPress?: (product: Product) => void
  listHeader?: React.ReactElement | null
  scrollHandler?: (event: any) => void
  variant?: 'grid' | 'featured'  // default 'grid'
}
```

When `variant === 'featured'`:
- Pass `numColumns={1}` to the FlatList
- DON'T pass `columnWrapperStyle` (it errors when numColumns < 2)
- contentContainerStyle.paddingBottom = 140 (room for the floating tab pill above)
- contentContainerStyle.paddingHorizontal = 16
- contentContainerStyle.gap = 16
- renderItem returns:
  ```tsx
  <ProductCard.Root product={item as Product} staggerIndex={index} onPress={() => onProductPress?.(item as Product)}>
    <ProductCard.FeaturedLayout />
  </ProductCard.Root>
  ```
  (NO wrapper `<View style={{ flex: 1 }}>` — single column doesn't need it)

When `variant === 'grid'` (default): keep all existing logic exactly as today. The destructured prop with default doesn't change behavior for current callers.

Use a small conditional in the render: branch on variant once and pass appropriate `numColumns`, `columnWrapperStyle`, `contentContainerStyle`, and `renderItem`.

For the skeleton/empty/error states in featured mode, reuse the existing SkeletonGrid (it's a 2-column skeleton — that's acceptable; or you may render `<ProductCardSkeleton />` stacked in 1 column. Up to you, keep it simple).

## Hard rules
- File ≤230 lines for ProductCard, ≤170 for ProductGrid
- All className colors via tokens (text-primary, text-muted) — they auto-swap with dark mode
- No raw Text
- No hex
- Reanimated only

## Acceptance
- `npx tsc --noEmit` clean
- Existing callers of ProductGrid (no `variant` prop) render the same 2-column grid as today
- New `<ProductGrid variant="featured" .../>` renders 1 large card per row, each card with image + bottom strip (name left, "Price" label + price right)
