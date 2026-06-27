# Wave 6 / Task — Product Detail rewrite (Trendora style)

## Spec source
Read `sdd/specs/redesign-trendora.md` — section "app/product/[id].tsx".
Read existing file first: `app/product/[id].tsx`.

## Prerequisites (assume already built in this wave)
- `src/components/ui/QuantityStepper.tsx` — default export `QuantityStepper`
- `src/components/layout/Header.tsx` now supports `roundedIcons?: boolean`
- `src/components/product/ImageCarousel/index.tsx` exports `ImageCarousel.SideThumbnails` and `Slide` accepts `aspectRatio` prop

## File to generate (overwrite)

`app/product/[id].tsx`  — **≤150 lines**

## Layout

Top-level `<View className="flex-1 bg-bg">` containing:

1. **Header** at top (NOT transparent):
   - `<Header showBack roundedIcons title="Details" rightElement={wishlistHeart} />`
   - `wishlistHeart`: Pressable with `Heart` icon (size 18, color = `Colors.accent` when wishlisted else `Colors.muted`, fill matches). Wrap in Animated.View whose style applies a spring scale on press via `useSharedValue` + `withSequence(withSpring(1.3, Spring.snappy), withSpring(1, Spring.gentle))`.

2. **ScrollView flex-1** with `contentContainerStyle={{ paddingBottom: 120 }}`:

   a. **Image card** (mx-4 mt-3, bg-surface rounded-card p-3, light shadow):
      - Row: left flex-1 contains `<ImageCarousel.Root images={product.images}><ImageCarousel.Slide aspectRatio={1} /></ImageCarousel.Root>` — but since `SideThumbnails` needs context too, place Root around BOTH columns. Restructure:
        ```tsx
        <ImageCarousel.Root images={product.images}>
          <View className="flex-row">
            <View className="flex-1"><ImageCarousel.Slide aspectRatio={1} /></View>
            <ImageCarousel.SideThumbnails />
          </View>
        </ImageCarousel.Root>
        ```

   b. **Info card** (mx-4 mt-3 bg-surface rounded-card p-4, light shadow):
      - Row 1: `<Typography variant="heading2" className="flex-1 mr-3">{product.name}</Typography>` + `<QuantityStepper value={qty} onChange={setQty} />`
      - Row 2 (mt-3, `flex-row items-center justify-between`):
        - Left col: `<Typography variant="body-sm" color="muted">From:</Typography><Typography variant="price">${product.price}</Typography>` stacked
        - Right: `<ColorSwatch colors={product.colors} selected={selectedColor!} onSelect={setSelectedColor} />` — only render when `selectedColor` is set

   c. **Size block** (mx-4 mt-4):
      - Typography heading3 "Select Size" mb-2
      - `<SizeSelector sizes={product.sizes} selected={selectedSize} onSelect={setSelectedSize} />`

   d. **Description** (mx-4 mt-4):
      - Typography heading3 "Description" mb-2
      - Animated.View with maxHeight (existing pattern with descHeight SharedValue: 72 collapsed → 300 expanded, withTiming Duration.slow)
      - Typography body color="muted" — product.description
      - Pressable "Read more" / "Read less" Typography body-sm color="accent" mt-2

3. **Footer** (absolute bottom, `bg-surface px-4 pt-3`, `paddingBottom: insets.bottom + 12`, light top border):
   - Row gap-3:
     - `<View className="flex-1"><Button variant="outline" fullWidth onPress={handleAddToCart}>Add to Cart</Button></View>`
     - `<View className="flex-1"><Button variant="primary" fullWidth onPress={handleBuyNow}>Buy Now</Button></View>`

## Handlers / state
- `const [qty, setQty] = useState(1)` (new)
- `const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null)`
- `const [selectedSize, setSelectedSize] = useState('')`
- `const [expanded, setExpanded] = useState(false)`
- useEffect on product set sensible defaults
- `handleAddToCart`: if product+selectedColor, call `addItem(product, selectedSize, selectedColor)` with `qty` times if cart store supports it — use a loop `for (let i = 0; i < qty; i++) addItem(product, selectedSize, selectedColor)` (the existing cart store's addItem auto-merges duplicates and increments quantity, so this works). Trigger `useCartBounce.trigger()`.
- `handleBuyNow`: same as handleAddToCart, then `router.push('/(tabs)/cart')`.
- isPending → `<ProductDetailSkeleton />`
- isError or !product → `<EmptyState icon={AlertCircle} title="Something went wrong" action={{ label: 'Try again', onPress: refetch }} />`

## Imports

```ts
import React, { useState, useEffect } from 'react'
import { ScrollView, View, Pressable } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, withSequence } from 'react-native-reanimated'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Heart, AlertCircle } from 'lucide-react-native'
import { useProduct } from '@/hooks/useProduct'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { useCartBounce, Spring, Duration } from '@/lib/animations'
import { ProductDetailSkeleton } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import Header from '@/components/layout/Header'
import Typography from '@/components/ui/Typography'
import Button from '@/components/ui/Button'
import { ImageCarousel } from '@/components/product/ImageCarousel'
import ColorSwatch from '@/components/product/ColorSwatch'
import SizeSelector from '@/components/product/SizeSelector'
import QuantityStepper from '@/components/ui/QuantityStepper'
import { Colors } from '@/constants/tokens'
import type { ProductColor } from '@/types'
```

## Hard rules
- ≤150 lines (use tight formatting where possible; you may inline the Buy Now/Add to Cart footer in a sub-function if helpful but it's not required)
- No raw Text — Typography only
- No raw hex
- Reanimated only
- `useSafeAreaInsets()` for the footer bottom padding

## Acceptance
- `npx tsc --noEmit` clean
- All three states render (loading skeleton, error, normal)
- Add to Cart adds `qty` units and bounces the cart icon
- Buy Now adds and navigates to /(tabs)/cart
- The two footer buttons sit side-by-side
