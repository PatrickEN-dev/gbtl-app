# Wave 5 / Task C — Product Detail Screen

## Spec source
Read `sdd/specs/screens.md` — contains full `## SCREENS` section including ProductDetail spec.
Read `sdd/specs/design.md` — contains `## ANIMATION SYSTEM` (usePressScale, useCartBounce, useSlideInRight).
Also read `sdd/tasks/shared-imports.md` for wave 4 component import paths (ImageCarousel, ColorSwatch, SizeSelector, ProductDetailSkeleton).

## Files to generate

1. `app/product/[id].tsx` — Product Detail (≤150 lines — keep logic in hooks)
   - `const { id } = useLocalSearchParams<{ id: string }>()`
   - `const { data: product, isPending, isError, refetch } = useProduct(id)`
   - `const { addItem } = useCart()`
   - `const { toggle, isWishlisted } = useWishlist()`
   - Local state: `selectedColor`, `selectedSize` (initialized to first available)

   **Loading state**: `<ProductDetailSkeleton />`
   **Error state**: EmptyState with AlertCircle + refetch button
   
   **Content layout** (ScrollView):
   - Absolute transparent Header (showBack + wishlist heart button using toggle/isWishlisted with spring)
   - `<ImageCarousel.Root images={product.images}>`
     - `<ImageCarousel.Slide />`
     - `<ImageCarousel.Thumbnails />`
     - `<ImageCarousel.Dots />`
   - Product info section (padding):
     - Row: Typography heading1 name + rating badge
     - Typography price (accent if sale + Typography muted strike-through originalPrice)
     - `<ColorSwatch>` with selectedColor state
     - `<SizeSelector>` with selectedSize state
     - Expandable description: Typography body, Reanimated `withTiming` on maxHeight 0→full, "Read more/less" toggle
   
   **Sticky bottom** (absolute positioned, safe area bottom):
   - `<Button variant="primary" fullWidth leftIcon={<ShoppingCart />}` 
   - `usePressScale(0.95)` + `useCartBounce()` triggers on press
   - `onPress`: `addItem(product, selectedSize, selectedColor)` → router.push('/(tabs)/cart')
