# Wave 6 / Task — CartItem visual refresh

## Spec source
Read `sdd/specs/redesign-trendora.md` — "CartItem.tsx" subsection.
Read the existing `src/components/cart/CartItem.tsx` first.

## File to modify

`src/components/cart/CartItem.tsx`

## Required changes (preserve API: same props, same swipe-to-delete behavior)

1. **Add a close (X) button** at the top-right of the row card:
   - Position: absolute top-2 right-2 (inside the white card View) — or place it as the first child of a new right column structure
   - 24x24 rounded-full `bg-bg items-center justify-center`
   - Icon: lucide `X`, size 14, color `Colors.muted`
   - onPress: call `onRemove()` directly (same as `handleDelete` but without swiping)
   - Use `hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}`

2. **Replace the right "$199.00" Typography with a dark price pill**:
   - The current right-most column shows `<Typography variant="price">$X.XX</Typography>`. Replace it with:
     - View `bg-primary rounded-pill px-3 py-1.5 items-center justify-center`
     - Typography body-sm weight=semibold color=white `$X.XX` (line-total — multiply price by quantity for clarity, OR keep unit price; keep unit price to preserve existing semantics)
   - Place this pill at the bottom-right of the row (the same right column the X sits at the top of)

## Layout suggestion (keep code small)

Top-level white card now has:
```
<View card>
  <X button absolute top-right>
  <Image left>
  <Info column middle: name, size, color, qty controls>
  <Price pill right-bottom>
</View>
```

Easiest path: keep the existing 3-column row structure (image | info | price column). Add the X button as `position: absolute` over the card. Convert the price Typography into the pill.

## Constraints
- Keep Swipeable + DeleteAction (do not remove swipe-to-delete; users can use either)
- Don't change props or imports of `useCart`, `useFadeInUp`, etc.
- All shadows keep both iOS and Android values
- No raw Text, no hex colors (use Colors.* for icon color only)
- Reanimated only

## Acceptance
- `npx tsc --noEmit` clean
- Pressing X removes the item without needing a swipe
- Price pill renders dark with white text
