# Wave 4 — Export Contract
# Linker reads this file to verify wave 4 outputs match these signatures
# Depends on: wave1-exports.md (types), wave2-exports.md (useCart, useWishlist), wave3-exports.md (Typography, Button, Skeleton, EmptyState)

## src/components/product/ProductCard/index.tsx
Namespace export required:
- `ProductCard` object with sub-components:
  - `ProductCard.Root` — Props: `{ product: Product, onPress: () => void, style?: StyleProp, className?: string }`, useFadeInUp(delay)
  - `ProductCard.Image` — expo-image with 3:4 aspect ratio
  - `ProductCard.Body` — container for Name + Price
  - `ProductCard.Name` — Typography heading3 numberOfLines=2
  - `ProductCard.Price` — Typography price + optional muted strikethrough
  - `ProductCard.Footer` — row container
  - `ProductCard.WishlistButton` — heart icon using useWishlistStore, spring scale animation
  - `ProductCard.NewBadge` — Badge variant="accent" "NEW"
  - `ProductCard.SaleBadge` — Badge variant="primary" "SALE"

## src/components/product/ProductGrid.tsx
Default export required:
- `ProductGrid` (React component)
  Props: `{ category?: string, animatedScrollY?: SharedValue<number> }`
  Uses useProducts(category) internally
  2-column FlatList with useStagger across cards
  States: isPending → 6 ProductCardSkeleton / isError → EmptyState + refetch / empty → EmptyState

## src/components/product/ColorSwatch.tsx
Default export required:
- `ColorSwatch` (React component)
  Props: `{ colors: ProductColor[], selected: ProductColor, onSelect: (color: ProductColor) => void }`
  EXCEPTION: hex values from ProductColor.hex ARE allowed as direct style values in this component only
  Shows color name label below swatches
  Selected swatch: accent border with Reanimated withSpring scale

## src/components/product/SizeSelector.tsx
Default export required:
- `SizeSelector` (React component)
  Props: `{ sizes: ProductSize[], selected: string, onSelect: (size: string) => void }`
  Unavailable sizes: muted + strikethrough, disabled press
  Selected size: accent background with Reanimated withTiming fill animation

## src/components/product/ImageCarousel/index.tsx
Namespace export required:
- `ImageCarousel` object with sub-components:
  - `ImageCarousel.Root` — Props: `{ images: string[], children: ReactNode }`
    Provides currentIndex via React.createContext
  - `ImageCarousel.Slide` — expo-image full-width, Gesture.Pan() horizontal swipe, withSpring snap
  - `ImageCarousel.Thumbnails` — horizontal scroll of small expo-images, tap to jump
  - `ImageCarousel.Dots` — row of dot indicators, active=accent

## src/components/cart/CartItem.tsx
Default export required:
- `CartItem` (React component)
  Props: `{ item: CartItem, onRemove: () => void }`
  Row layout: 60×80 expo-image thumbnail + info (name/size/color) + qty controls (−/qty/+) + price
  Swipeable delete via Swipeable from react-native-gesture-handler (red delete area)
  Quantity controls: useCart().updateQuantity, min qty=1 (remove if decrement at 1)
  useFadeInUp() on mount

## src/components/cart/CartSummary.tsx
Default export required:
- `CartSummary` (React component)
  Props: none (reads useCart() internally)
  Shows: subtotal, delivery ($0.00 "FREE" in accent if ≥$200, else $16.00), total
  Nudge message if subtotal < 200: "FREE delivery on orders over $200"

## src/components/forms/Field/index.tsx
Named export required:
- `Field` (object with sub-components)
  - `Field.Root` — Props: `{ control: Control, name: string, rules?: RegisterOptions, children: ReactNode }`
    Provides { value, onChange, error } via React.createContext
  - `Field.Label` — Props: `{ children: string }`, Typography body-sm color=primary
  - `Field.Input` — Props: forwarded to TextInput, reads value/onChange from context
    Focus: border-accent, Blur: border-border
  - `Field.Error` — Props: none (reads error from context)
    Reanimated height animation 0→auto on error appear
    Typography caption color=accent (error color)

## src/components/forms/LoginForm.tsx
Default export required:
- `LoginForm` (React component)
  Props: none (self-contained)
  useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })
  Fields: email + password
  Submit: useAuth().login → router.replace('/(tabs)/')
  Shows field-level errors via Field.Error
  Button loading state while submitting

## src/components/forms/CheckoutForm.tsx
Default export required:
- `CheckoutForm` (React component)
  Props: none (self-contained)
  Renders inside BottomSheetScrollView
  useForm<CheckoutFormData>({ resolver: zodResolver(checkoutSchema) })
  Sections: Personal (fullName, address, city) + Payment (cardNumber, expiry, cvv)
  Submit: useCart().clearCart → dismiss bottom sheet
