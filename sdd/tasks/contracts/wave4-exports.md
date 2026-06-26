# Wave 4 — Export Contract
# Linker: grep for these exact strings in the generated files.
# Depends on: wave1-exports.md (types), wave2-exports.md (useCart, useWishlist), wave3-exports.md (Typography, Button, Skeleton, EmptyState)

## src/components/product/ProductCard/index.tsx
grep target: `export const ProductCard = {`
Sub-keys required in that object: Root, Image, Body, Name, Price, Footer, WishlistButton, NewBadge, SaleBadge

## src/components/product/ProductGrid.tsx
grep target: `export default` (default export named ProductGrid)

## src/components/product/ColorSwatch.tsx
grep target: `export default` (default export named ColorSwatch)

## src/components/product/SizeSelector.tsx
grep target: `export default` (default export named SizeSelector)

## src/components/product/ImageCarousel/index.tsx
grep target: `export const ImageCarousel = {`
Sub-keys required: Root, Slide, Thumbnails, Dots

## src/components/cart/CartItem.tsx
grep target: `export default` (default export named CartItem)
grep target: `Swipeable` (swipe-to-delete must use gesture-handler Swipeable)

## src/components/cart/CartSummary.tsx
grep target: `export default` (default export named CartSummary)
grep target: `useCart` (reads cart state internally — no props)

## src/components/forms/Field/index.tsx
grep target: `export const Field = {`
Sub-keys required: Root, Label, Input, Error

## src/components/forms/LoginForm.tsx
grep target: `export default` (default export named LoginForm)
grep target: `zodResolver` (must use react-hook-form + zod)
grep target: `useAuth` (must call useAuth().login, not authService directly)

## src/components/forms/CheckoutForm.tsx
grep target: `export default` (default export named CheckoutForm)
grep target: `BottomSheetScrollView` (must render inside bottom sheet scroll)
grep target: `zodResolver`
