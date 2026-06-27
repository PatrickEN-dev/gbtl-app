# Wave 9 / Task — Consumer refactors (use primitives)

## Spec source
Read `sdd/specs/redesign-trendora-v3.md` — "Consumer refactors" subsection.

## Prerequisites (verify they exist by reading them)

- `src/components/primitives/Card.tsx` (Card.Root/Body/Header/Footer)
- `src/components/primitives/Pill.tsx` (default export `Pill`)
- `src/components/primitives/IconButton.tsx` (default export `IconButton`)

## Files to modify

1. `src/components/cart/CartItem.tsx`
2. `src/components/cart/CartSummary.tsx`
3. `src/components/layout/Header.tsx`
4. `src/components/ui/SearchBar.tsx`
5. `app/(tabs)/index.tsx`
6. `app/(tabs)/cart.tsx`
7. `app/product/[id].tsx`

You will modify ALL seven files. Each change is small.

## 1. cart/CartItem.tsx

- Replace the outer `<View className="flex-row bg-surface rounded-2xl p-3 mb-3" style={...shadow...}>` with `<Card.Root variant="elevated" padding="sm" className="flex-row mb-3 relative">`.
- Replace the X close button Pressable block with:
  ```tsx
  <View className="absolute top-2 right-2" style={{ zIndex: 1 }}>
    <IconButton icon={<X size={14} color={colors.muted} />} variant="surface" size="sm" onPress={onRemove} accessibilityLabel="Remove item" />
  </View>
  ```
  where `colors = useThemeColors()`.
- Replace the price pill outer `<View className="bg-primary rounded-pill px-3 py-1.5 items-center justify-center">` with `<Pill variant="solid" tone="primary" size="sm">${product.price.toFixed(2)}</Pill>`.
- Drop the local shadow style and unused `Colors` import. Add: `import { Card } from '@/components/primitives/Card'`, `import { default as Pill } from '@/components/primitives/Pill'` (or just `import Pill from '@/components/primitives/Pill'`), `import IconButton from '@/components/primitives/IconButton'`, and `import { useThemeColors } from '@/hooks/useThemeColors'`.

## 2. cart/CartSummary.tsx

Replace the outer `<View ...>` containing the summary with `<Card.Root variant="elevated" padding="md">`. Keep everything inside (the title Typography, SummaryRow components, Separator, total) unchanged. Drop the local shadow style and the `Colors` import (no longer needed). Import: `import { Card } from '@/components/primitives/Card'`.

## 3. layout/Header.tsx

Refactor to use IconButton for back and right slots. Drop the `RoundedSlot` helper entirely.

```tsx
const backButton = showBack ? (
  <IconButton
    icon={<ChevronLeft size={24} color={iconColor} />}
    variant={roundedIcons ? 'surface' : 'ghost'}
    onPress={() => router.back()}
    accessibilityLabel="Go back"
  />
) : null

const cartButton = showCart ? (
  <IconButton
    icon={<ShoppingBag size={24} color={iconColor} />}
    variant={roundedIcons ? 'surface' : 'ghost'}
    badge={totalItems > 0 ? totalItems : undefined}
    onPress={() => router.push('/(tabs)/cart')}
    accessibilityLabel="Open cart"
  />
) : null
```

The `rightElement` slot still passes through, but wrap in IconButton when `roundedIcons` is true:
```tsx
{rightElement && (roundedIcons
  ? <IconButton icon={rightElement} variant="surface" />
  : rightElement
)}
```

Wait — `rightElement` is already a JSX node (typically a Pressable with a Heart). Passing it as IconButton.icon would nest a Pressable inside another Pressable. Better: when `roundedIcons` is true and rightElement is provided, render rightElement INSIDE a styled surface wrapper. Simplest: keep the old `RoundedSlot` for `rightElement` (since it's an opaque node), and use IconButton only for back/cart buttons we own. So:

```tsx
const rightSlot = rightElement
  ? (roundedIcons ? <View className="w-10 h-10 bg-surface rounded-full items-center justify-center" style={surfaceShadow}>{rightElement}</View> : rightElement)
  : null
```

Drop `usePressScale` imports + the inline backPress/cartPress hooks (IconButton owns its press scale now). File should shrink. Keep all existing JSX structure outside the buttons.

## 4. ui/SearchBar.tsx

Replace the inner filter button block:
```tsx
<Animated.View style={animatedStyle}>
  <Pressable className="rounded-pill bg-primary h-9 px-4 flex-row items-center gap-1.5" ...>
    <SlidersHorizontal size={14} color={Colors.surface} />
    <Typography variant="body-sm" color="white" weight="semibold">Filter</Typography>
  </Pressable>
</Animated.View>
```

With:
```tsx
<Pill
  variant="solid"
  tone="primary"
  size="md"
  leftIcon={<SlidersHorizontal size={14} color={colors.surface} />}
  onPress={onFilterPress}
>
  Filter
</Pill>
```

Replace `import { Colors }` with `const colors = useThemeColors()` (call inside the component). Drop the `usePressScale` import + local hook usage (Pill owns its press scale). Drop the now-unused `Animated` import if nothing else needs it.

Add: `import Pill from '@/components/primitives/Pill'` and `import { useThemeColors } from '@/hooks/useThemeColors'`.

## 5. app/(tabs)/index.tsx

Three changes:

a. **Cart icon** in the top row: replace
```tsx
<Animated.View style={cartPress.animatedStyle}>
  <Pressable ...>
    <ShoppingBag size={22} color={Colors.primary} />
    {totalItems > 0 && (<View className="absolute -top-1 -right-1"><Badge variant="accent" size="sm">{totalItems}</Badge></View>)}
  </Pressable>
</Animated.View>
```
with:
```tsx
<IconButton
  icon={<ShoppingBag size={20} color={colors.primary} />}
  variant="ghost"
  size="md"
  badge={totalItems > 0 ? totalItems : undefined}
  onPress={() => router.push('/(tabs)/cart')}
  accessibilityLabel="Open cart"
/>
```

Drop `cartPress = usePressScale(...)` line. Drop `Badge` import.

b. **Category chips** — remove the `CategoryChip` function entirely. Replace the FlatList renderItem with:
```tsx
renderItem={({ item }) => (
  <View className="mr-2">
    <Pill
      variant={activeCategory === item ? 'solid' : 'ghost'}
      tone="primary"
      size="sm"
      onPress={() => setActiveCategory(item)}
    >
      {item}
    </Pill>
  </View>
)}
```

Drop the now-unused imports: `useSharedValue`, `useAnimatedStyle`, `withTiming`, `interpolateColor`, `Duration`, the `Animated` import if not used elsewhere, and `Colors` (use `colors = useThemeColors()`).

c. **ProductGrid**: add `variant="featured"` prop:
```tsx
<ProductGrid
  variant="featured"
  products={data ?? []}
  isPending={isPending}
  isError={isError}
  refetch={refetch}
  onProductPress={(p) => router.push(`/product/${p.id}`)}
/>
```

Add imports: `import Pill from '@/components/primitives/Pill'`, `import IconButton from '@/components/primitives/IconButton'`, `import { useThemeColors } from '@/hooks/useThemeColors'`.

Keep file ≤150 lines.

## 6. app/(tabs)/cart.tsx

Replace the "My Cart" summary card View:
```tsx
<View className="mx-4 mt-4 mb-2 bg-surface rounded-card p-4 flex-row items-center justify-between" style={{...shadow...}}>
  <Typography variant="heading3" weight="semibold">My Cart</Typography>
  <Pressable onPress={handleCheckout}>
    <Animated.View style={ctaPress.animatedStyle} className="flex-row items-center gap-2 bg-primary rounded-pill px-4 h-9">
      <ShoppingBag size={14} color={Colors.surface} />
      <Typography variant="body-sm" weight="semibold" color="white">Add to Checkout</Typography>
    </Animated.View>
  </Pressable>
</View>
```

With:
```tsx
<Card.Root variant="elevated" padding="md" className="mx-4 mt-4 mb-2 flex-row items-center justify-between">
  <Typography variant="heading3" weight="semibold">My Cart</Typography>
  <Pill
    variant="solid"
    tone="primary"
    size="md"
    leftIcon={<ShoppingBag size={14} color={colors.surface} />}
    onPress={handleCheckout}
  >
    Add to Checkout
  </Pill>
</Card.Root>
```

Add imports: `import { Card } from '@/components/primitives/Card'`, `import Pill from '@/components/primitives/Pill'`, `import { useThemeColors } from '@/hooks/useThemeColors'`. Drop `usePressScale`, `Animated`, `Colors`. Keep `Pressable` import only if still used elsewhere (it isn't after this change → drop it too).

Keep file ≤120 lines.

## 7. app/product/[id].tsx

Replace `<View className="mx-4 mt-3 bg-surface rounded-card p-3" style={shadow}>` (image card) with `<Card.Root variant="elevated" padding="sm" className="mx-4 mt-3">`.
Replace `<View className="mx-4 mt-3 bg-surface rounded-card p-4" style={shadow}>` (info card) with `<Card.Root variant="elevated" padding="md" className="mx-4 mt-3">`.

Drop the local `shadow` constant entirely. Add import: `import { Card } from '@/components/primitives/Card'`.

Keep file ≤150 lines.

## Hard rules
- Every modified file: `npx tsc --noEmit` clean
- No raw `<Text>`
- No hex literals
- Use `useThemeColors()` for JS-side colors (lucide `color={...}`, shadows)
- Theme classes (bg-X, text-X, border-X) auto-swap with dark mode — leave them be
- Reanimated only

## Acceptance
- All 7 files compile under `tsc --noEmit`
- Cart item renders the same shape as today but uses Card + Pill + IconButton internally
- CartSummary renders the same
- Header back/right buttons use IconButton (cleaner)
- SearchBar Filter pill uses Pill primitive
- Home cart icon uses IconButton; category chips use Pill; products render in 1-column featured layout
- Cart "My Cart" header uses Card + Pill
- Product detail image and info cards use Card
