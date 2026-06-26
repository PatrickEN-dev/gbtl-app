# Wave 4 / Task A — ProductCard + Grid + Color/Size selectors

## Spec source
- `## DESIGN PATTERNS` (lines 253–280) — Compound component pattern
- `## ANIMATION SYSTEM` (lines 332–371) — useFadeInUp, usePressScale, useStagger, useCartBounce
- Read wave 1/2 outputs: `src/types/index.ts`, `src/hooks/useWishlist.ts`

## Files to generate

1. `src/components/product/ProductCard/index.tsx` — Compound component
   - `ProductCard.Root`: Animated.View with `useFadeInUp(staggerIndex * 80)` + `usePressScale(0.97)`. Props: `product`, `onPress`, `staggerIndex?`
   - `ProductCard.Image`: expo-image, aspect ratio 3:4, `contentFit="cover"`, rounded-card
   - `ProductCard.Body`: padding container for name/price
   - `ProductCard.Name`: Typography body-sm color=primary numberOfLines=2
   - `ProductCard.Price`: handles sale (strike-through originalPrice + accent current price) or regular price. Typography price variant.
   - `ProductCard.Footer`: row with WishlistButton right-aligned
   - `ProductCard.WishlistButton`: Heart icon, filled/unfilled from useWishlist().isWishlisted(id), spring scale animation on press
   - `ProductCard.NewBadge`: Badge variant=accent "NEW" — show only when product.isNew
   - `ProductCard.SaleBadge`: Badge variant=error "SALE" — show only when product.isSale
   - Export namespace: `export const ProductCard = { Root, Image, Body, Name, Price, Footer, WishlistButton, NewBadge, SaleBadge }`

2. `src/components/product/ProductGrid.tsx`
   - FlatList with numColumns=2, columnWrapperStyle gap
   - While `isPending`: render 6 ProductCardSkeleton in same 2-column layout
   - While `isError`: EmptyState with AlertCircle icon + refetch button
   - While data=[]: EmptyState with Package icon + CTA
   - Each card: `<ProductCard.Root staggerIndex={index}>` with all compound children
   - Pull-to-refresh via RefreshControl calling refetch()

3. `src/components/product/ColorSwatch.tsx`
   - Props: `colors: ProductColor[]`, `selected: ProductColor`, `onSelect: (color: ProductColor) => void`
   - 28px circles, `backgroundColor` from color.hex (this is the ONE place hex is allowed — it's dynamic data)
   - Selected: accent ring (border-2 border-accent with 2px gap)
   - Spring scale on press
   - Color name label: Typography caption color=muted below swatches

4. `src/components/product/SizeSelector.tsx`
   - Props: `sizes: ProductSize[]`, `selected: string`, `onSelect: (size: string) => void`
   - Pill chips (border rounded-pill), min-width 44px, centered text
   - Selected: bg-primary text-white
   - Unavailable: opacity-40, not pressable (onPress does nothing, show line-through)
   - withTiming transition on background color change
