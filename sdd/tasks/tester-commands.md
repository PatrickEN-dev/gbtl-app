# GBTL Tester Commands
# Tester agent: run the commands for the current wave. Report PASS or FAIL with output.

## Wave 1 — Config + Foundation

```bash
# 1. All config files exist
for f in package.json babel.config.js tailwind.config.js metro.config.js global.css app.json tsconfig.json; do
  [ -f "$f" ] && echo "OK: $f" || echo "MISSING: $f"
done

# 2. All src foundation files exist
for f in src/types/index.ts src/constants/tokens.ts src/data/mockProducts.ts \
         src/services/products.ts src/services/auth.ts \
         src/lib/queryClient.ts src/lib/secureStore.ts src/lib/animations.ts \
         src/schemas/login.schema.ts src/schemas/checkout.schema.ts; do
  [ -f "$f" ] && echo "OK: $f" || echo "MISSING: $f"
done

# 3. Babel plugin order
grep -n "reanimated" babel.config.js  # must be LAST plugin entry

# 4. Tailwind has required brand colors
grep "accent" tailwind.config.js && grep "surface" tailwind.config.js

# 5. Mock products count (must be 12)
grep -c "id:" src/data/mockProducts.ts
```

## Wave 2 — Stores + Hooks

```bash
# 1. Zustand v5 double paren pattern
grep -n "create<" src/store/*.ts
# Expected output: each line must have ()( not just (

# 2. No token in authStore state
grep -n "token" src/store/authStore.ts
# Expected: zero results (token lives only in SecureStore)

# 3. TanStack v5 syntax in hooks
grep -n "useQuery" src/hooks/*.ts
# Expected: all matches use object syntax { queryKey, queryFn }

# 4. useAuth restoreSession calls getToken
grep -n "getToken" src/hooks/useAuth.ts  # must be present

# 5. All hook files exist
for f in src/hooks/useProducts.ts src/hooks/useProduct.ts src/hooks/useCart.ts \
         src/hooks/useWishlist.ts src/hooks/useAuth.ts src/hooks/useBottomSheet.ts; do
  [ -f "$f" ] && echo "OK: $f" || echo "MISSING: $f"
done
```

## Wave 3 — UI Components

```bash
# 1. No raw <Text> in new components (except Typography.tsx itself)
grep -rn "<Text[ >]" src/components/ | grep -v "Typography.tsx"
# Expected: zero results

# 2. No hardcoded colors (except ColorSwatch — not in wave 3)
grep -rn "#[0-9A-Fa-f]\{3,6\}" src/components/ui/ src/components/layout/
# Expected: zero results

# 3. ScreenWrapper has both render-prop and plain-children code paths
grep -n "typeof children" src/components/layout/ScreenWrapper.tsx
# Expected: contains typeof check or similar union handling

# 4. Header has rightElement prop
grep -n "rightElement" src/components/layout/Header.tsx

# 5. TabBar imports BlurView and Platform
grep -n "BlurView\|Platform" src/components/layout/TabBar.tsx
```

## Wave 4 — Product + Cart + Forms

```bash
# 1. ProductCard compound export
grep -n "export const ProductCard" src/components/product/ProductCard/index.tsx

# 2. ImageCarousel compound export
grep -n "export const ImageCarousel" src/components/product/ImageCarousel/index.tsx

# 3. Field compound export
grep -n "export const Field" src/components/forms/Field/index.tsx

# 4. CartItem uses Swipeable (not custom swipe)
grep -n "Swipeable" src/components/cart/CartItem.tsx

# 5. ColorSwatch: hex allowed here (dynamic from data)
grep -n "backgroundColor.*hex" src/components/product/ColorSwatch.tsx

# 6. CheckoutForm renders inside BottomSheetScrollView
grep -n "BottomSheetScrollView" src/components/forms/CheckoutForm.tsx
```

## Wave 5 — Screens (runs tsc at the end)

```bash
# 1. Root layout line 1
head -1 app/_layout.tsx
# Expected: import 'react-native-gesture-handler'

# 2. Root layout has all required providers
grep -n "GestureHandlerRootView\|QueryClientProvider\|BottomSheetModalProvider" app/_layout.tsx

# 3. Tabs layout has exactly 4 screens
grep -c "<Tabs.Screen" app/(tabs)/_layout.tsx
# Expected: 4

# 4. Default Expo files deleted
[ ! -f "app/(tabs)/explore.tsx" ] && echo "OK: explore.tsx deleted" || echo "FAIL: explore.tsx still exists"
[ ! -f "app/modal.tsx" ] && echo "OK: modal.tsx deleted" || echo "FAIL: modal.tsx still exists"

# 5. All screen files exist and are ≤150 lines
for f in "app/_layout.tsx" "app/+not-found.tsx" "app/(auth)/_layout.tsx" "app/(auth)/login.tsx" \
         "app/(tabs)/_layout.tsx" "app/(tabs)/index.tsx" "app/(tabs)/collection.tsx" \
         "app/(tabs)/cart.tsx" "app/(tabs)/profile.tsx" "app/product/[id].tsx"; do
  if [ -f "$f" ]; then
    lines=$(wc -l < "$f")
    [ "$lines" -le 150 ] && echo "OK ($lines lines): $f" || echo "WARN ($lines lines > 150): $f"
  else
    echo "MISSING: $f"
  fi
done

# 6. TypeScript compilation (must pass before wave 5 is marked complete)
npx tsc --noEmit 2>&1
```
