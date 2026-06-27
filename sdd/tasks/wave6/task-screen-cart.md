# Wave 6 / Task — Cart screen tune-up (Trendora style)

## Spec source
Read `sdd/specs/redesign-trendora.md` — section "app/(tabs)/cart.tsx".
Read existing file first: `app/(tabs)/cart.tsx`.

## Prerequisites
- `src/components/layout/Header.tsx` now supports `roundedIcons?: boolean`
- `src/components/cart/CartItem.tsx` has the new visual (X button + price pill) — already updated in parallel task

## File to modify

`app/(tabs)/cart.tsx` — **≤150 lines**

## Required changes

1. Replace the header line:
   - From: `<Header title="Cart" />`
   - To:   `<Header title="My Cart" roundedIcons />` (no back button; this is a tab root)

2. Inside the `items.length > 0` branch, ABOVE the FlatList, render a "cart summary action" card:

   ```tsx
   <View
     className="mx-4 mt-4 mb-2 bg-surface rounded-card p-4 flex-row items-center justify-between"
     style={{
       shadowColor: Colors.primary,
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.06,
       shadowRadius: 8,
       elevation: 2,
     }}
   >
     <Typography variant="heading3" weight="semibold">My Cart</Typography>
     <Pressable onPress={handleCheckout}>
       <Animated.View
         style={ctaPress.animatedStyle}
         className="flex-row items-center gap-2 bg-primary rounded-pill px-4 h-9"
       >
         <ShoppingBag size={14} color={Colors.surface} />
         <Typography variant="body-sm" weight="semibold" color="white">Add to Checkout</Typography>
       </Animated.View>
     </Pressable>
   </View>
   ```

   Where `ctaPress = usePressScale(0.95)` is declared at the top of the component. Add `Pressable` to the existing react-native import, `Animated` from react-native-reanimated, and `Colors` from tokens. Also import `usePressScale`.

3. Keep everything else identical:
   - The FlatList of CartItem
   - The CartSummary
   - The bottom Checkout button (existing Button variant="primary" — DO NOT remove)
   - The BottomSheetModal + CheckoutForm
   - The empty state branch (just an EmptyState)

## Constraints
- File must remain ≤150 lines
- No raw `<Text>`, no hex
- Reanimated only (no Animated from react-native)
- Both iOS shadow + Android elevation on any new shadow

## Acceptance
- `npx tsc --noEmit` clean
- Header shows "My Cart" centered with rounded surface icons available (no back button shown)
- "Add to Checkout" pill is visible above the cart list when items > 0 and triggers the same handleCheckout flow
- Empty cart still shows EmptyState + Browse Collection CTA
