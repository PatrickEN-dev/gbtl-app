# Wave 4 / Task C — Cart Components + Forms

## Spec source
Read `sdd/specs/data.md` — contains `## FORMS` with LoginForm and CheckoutForm specs, and `## FORMS (Schemas)` with exact Zod schema code.
Read `sdd/specs/screens.md` — contains `## CROSS-PLATFORM RULES` for KeyboardAvoidingView pattern.
Also read wave 1 outputs: `src/schemas/*.ts` | wave 2: `src/hooks/useCart.ts`, `src/hooks/useAuth.ts`

## Files to generate

1. `src/components/cart/CartItem.tsx`
   - Props: `item: CartItem`, `onRemove: () => void`
   - Layout: row — thumbnail (60×80 expo-image) + product info (name, size, color) + quantity controls (−/qty/+) + price
   - Swipeable delete (react-native-gesture-handler Swipeable) revealing red delete area
   - `useFadeInUp()` on mount
   - Quantity controls: `useCart().updateQuantity()`, min qty=1 (remove if decrement at 1)

2. `src/components/cart/CartSummary.tsx`
   - Props: none (reads from `useCart()`)
   - Shows: subtotal, delivery fee ($16.00 or "FREE" if > $200 with accent color), total
   - "FREE delivery on orders over $200" nudge if subtotal < 200
   - All values formatted as currency ($XX.XX)

3. `src/components/forms/Field/index.tsx` — Compound component using react-hook-form Controller
   - `Field.Root`: takes `control`, `name`, `rules?`. Provides context via React.createContext.
   - `Field.Label`: Typography body-sm color=primary
   - `Field.Input`: TextInput with focus border (border-accent when focused, border-border default). Reads value/onChange from Field context. Props forwarded to TextInput.
   - `Field.Error`: Reanimated height animation (0→auto) on error appear. Typography caption color=error.
   - Export: `export const Field = { Root, Label, Input, Error }`

4. `src/components/forms/LoginForm.tsx`
   - `useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })`
   - Two fields: email (keyboard=email-address) + password (secureTextEntry)
   - Submit: `useAuth().login(email, password)` → on success: `router.replace('/(tabs)/')`
   - Loading state on Button while submitting
   - Show field-level errors via `Field.Error`
   - "Forgot password?" TouchableOpacity (does nothing — placeholder)

5. `src/components/forms/CheckoutForm.tsx`
   - Renders inside `<BottomSheetScrollView>` from @gorhom/bottom-sheet
   - `useForm<CheckoutFormData>({ resolver: zodResolver(checkoutSchema) })`
   - Sections: Personal (fullName, address, city) + Payment (cardNumber, expiry, cvv)
   - Submit: `useCart().clearCart()` → dismiss bottom sheet
   - Loading state on submit button
