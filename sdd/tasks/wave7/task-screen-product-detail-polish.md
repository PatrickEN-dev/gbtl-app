# Wave 7 / Task — Product Detail polish

## Spec source
Read `sdd/specs/redesign-trendora-v2.md` — "app/product/[id].tsx" subsection.
Read the existing file first: `app/product/[id].tsx`.

## Prerequisites built in parallel this wave

- `src/components/product/ColorSwatch.tsx` now accepts `hideLabel?: boolean`
- `src/components/ui/Button.tsx` now accepts `rounded?: 'btn' | 'pill'`

## File to modify

`app/product/[id].tsx`

## Required changes (small)

### 1. Pass `hideLabel` to ColorSwatch

Find:
```tsx
{selectedColor && (
  <ColorSwatch colors={product.colors} selected={selectedColor} onSelect={setSelectedColor} />
)}
```

Change to:
```tsx
{selectedColor && (
  <ColorSwatch colors={product.colors} selected={selectedColor} onSelect={setSelectedColor} hideLabel />
)}
```

### 2. Use `rounded="pill"` on both footer buttons

Find:
```tsx
<View className="flex-1"><Button variant="outline" fullWidth onPress={handleAddToCart}>Add to Cart</Button></View>
<View className="flex-1"><Button variant="primary" fullWidth onPress={handleBuyNow}>Buy Now</Button></View>
```

Change to:
```tsx
<View className="flex-1"><Button variant="outline" fullWidth rounded="pill" onPress={handleAddToCart}>Add to Cart</Button></View>
<View className="flex-1"><Button variant="primary" fullWidth rounded="pill" onPress={handleBuyNow}>Buy Now</Button></View>
```

### 3. Ensure footer leaves room above the floating tab pill

The detail screen footer is `absolute bottom-0`. The new floating tab pill (height ~64 with margins ~16 = ~80 visible) sits on top of any tab screen. But product detail is NOT inside the `(tabs)` group — it's at `app/product/[id].tsx` — so the tab bar is NOT shown on this route. **No change needed for footer positioning.** Leave it as-is.

### Nothing else changes

Header, image card, info card, size selector, description block, handlers all stay identical.

## Constraints

- File MUST stay ≤150 lines
- All hard rules from CLAUDE.md

## Acceptance

- `npx tsc --noEmit` clean
- ColorSwatch on detail no longer shows the color name label
- Both footer buttons render with the pill (fully rounded) shape
