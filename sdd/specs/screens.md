# GBTL — Screens Spec
# Scope: screens, cross-platform rules, loading states, error boundary, output order
# Used by: Wave 5 (task-screens-auth, task-screens-tabs, task-screens-product)

## SCREENS

### app/_layout.tsx (Root)
```tsx
import 'react-native-gesture-handler'  // LINE 1 — MANDATORY

// Provider order (outermost → innermost):
// ErrorBoundary → GestureHandlerRootView → SafeAreaProvider → QueryClientProvider → BottomSheetModalProvider → Stack

// On module load:
SplashScreen.preventAutoHideAsync()

// On mount:
// 1. useAuth().restoreSession() — check SecureStore for saved token
// 2. After fonts + session ready → SplashScreen.hideAsync()

// StatusBar: <StatusBar style="auto" /> from expo-status-bar
// Stack: headerShown: false on all screens
// Max 150 lines
```

### app/(auth)/_layout.tsx
```tsx
// If useAuth().isAuthenticated → <Redirect href="/(tabs)/" />
// Else → <Stack screenOptions={{ headerShown: false }} />
```

### app/(auth)/login.tsx (≤150 lines)
```tsx
// ScreenWrapper (not scrollable, KeyboardAvoidingView)
// useScaleIn() on the card container
// GBTL wordmark:
//   Typography variant="display" color="accent" → "GBTL"
//   Typography variant="body-sm" color="muted"  → "YOUR VISION YOUR STYLE"
// <LoginForm />  ← all form logic in LoginForm component
// "Continue as guest" → router.replace('/(tabs)/')
```

### app/+not-found.tsx
```tsx
// ScreenWrapper (not scrollable)
// EmptyState with AlertCircle icon
// title="Page not found"
// action={{ label: "Go Home", onPress: () => router.replace('/(tabs)/') }}
```

### app/(tabs)/_layout.tsx
```tsx
// <Tabs tabBar={(props) => <TabBar {...props} />}>
// 4 tabs: index (Home icon), collection (Grid icon), cart (ShoppingBag icon), profile (User icon)
// Each tab: headerShown: false
```

### app/(tabs)/index.tsx — Home (≤150 lines)
```tsx
// ScreenWrapper scrollable — provides scrollY SharedValue via render prop
// Hero banner:
//   - Full-width expo-image (aspect ratio 16:9)
//   - useParallax(scrollY, 0.3) on image
//   - Overlay with Typography display "YOUR VISION YOUR STYLE"
//   - Button primary "Explore Collection" → router.push('/(tabs)/collection')
// Category chips:
//   - ['All', 'Men', 'Women', 'Kids'] in horizontal FlatList
//   - Local useState for active category
//   - Reanimated withTiming on chip background (accent active / surface inactive)
//   - usePressScale(0.95) on each chip
// <ProductGrid category={activeCategory} />
//   - useProducts(category) inside ProductGrid
//   - isPending → show 6 skeleton cards
//   - isError → EmptyState with refetch
```

### app/(tabs)/collection.tsx — Collection (≤150 lines)
```tsx
// <Header title="Collection" showCart />
// Sort bar: ['Relevance', 'Price ↑', 'Price ↓', 'Newest']
//   - Local useState for sort option
//   - Sort products client-side before passing to FlatList
// const { data, isPending, isError, refetch } = useProducts()
// isPending → 6 skeleton cards
// isError → EmptyState with refetch button
// data.length === 0 → EmptyState "No products found"
// else → FlatList 2-col of ProductCard (with stagger animation)
```

### app/(tabs)/cart.tsx — Cart (≤150 lines)
```tsx
// <Header title="Cart" />
// const { items, total } = useCart()
// const { ref, present } = useBottomSheet()
// items.length === 0:
//   EmptyState with ShoppingBag icon + "Browse Collection" → /(tabs)/collection
// else:
//   FlatList of <CartItem item={i} onRemove={() => removeItem(...)} />
//   Sticky footer: <CartSummary />
//   Button primary fullWidth "Checkout" onPress={present}
// <BottomSheetModal ref={ref} snapPoints={['75%', '90%']}>
//   <CheckoutForm />
// </BottomSheetModal>
```

### app/(tabs)/profile.tsx — Profile (≤150 lines)
```tsx
// <Header title="Profile" />
// const { user, logout } = useAuth()
// Avatar circle (64×64) with initials from user?.name
//   useScaleIn() on mount
// Typography heading2 user.name
// Typography body-sm color=muted user.email
// Menu rows (TouchableOpacity): Orders, Wishlist, Settings → placeholders
// Logout row: logout() + router.replace('/(auth)/login')
// On mount: Notifications.requestPermissionsAsync() — handle granted/denied
```

### app/product/[id].tsx — ProductDetail (≤150 lines)
```tsx
// const { id } = useLocalSearchParams<{ id: string }>()
// const { data: product, isPending, isError, refetch } = useProduct(id)
// const { addItem } = useCart()
// const { toggle, isWishlisted } = useWishlist()
// Local state: selectedColor (init to product.colors[0])
//             selectedSize (init to first available size)

// isPending → <ProductDetailSkeleton />
// isError → EmptyState with AlertCircle + refetch button

// Content (ScrollView):
//   - Absolute transparent Header (showBack + wishlist heart button)
//     Heart: filled/unfilled with useScaleIn spring on toggle
//   - <ImageCarousel.Root images={product.images}>
//       <ImageCarousel.Slide />   ← Gesture.Pan() swipe, withSpring snap
//       <ImageCarousel.Thumbnails />
//       <ImageCarousel.Dots />
//     </ImageCarousel.Root>
//   - Product info section (padding=16):
//     - Row: Typography heading1 name + Badge rating
//     - Row: Typography price (accent if isSale) + Typography muted strikethrough originalPrice
//     - <ColorSwatch colors={product.colors} selected={selectedColor} onSelect={setSelectedColor} />
//     - <SizeSelector sizes={product.sizes} selected={selectedSize} onSelect={setSelectedSize} />
//     - Expandable description:
//       Typography body description (clamped)
//       "Read more/less" toggle with Reanimated maxHeight withTiming(0 ↔ 200, slow)
// Sticky bottom (absolute, safe area bottom + 16):
//   <Animated.View style={usePressScale(0.95).animatedStyle}>
//     <Button variant="primary" fullWidth leftIcon={<ShoppingCart size={18} />}
//       onPress={() => { addItem(product, selectedSize, selectedColor); router.push('/(tabs)/cart') }}>
//       Add to Cart
//     </Button>
//   </Animated.View>
```

---

## CROSS-PLATFORM RULES

```
KeyboardAvoidingView:
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}

Bottom tab bar:
  iOS: <BlurView intensity={80} tint="light"> wrapper
  Android: solid backgroundColor="#FFFFFF"
  Detect with Platform.OS === 'ios'

Safe area:
  ScreenWrapper uses useSafeAreaInsets() for top/bottom padding
  NEVER hardcode padding for device edges (e.g., paddingTop: 44)

Shadows — ALWAYS define both:
  iOS: shadowColor, shadowOffset, shadowOpacity, shadowRadius
  Android: elevation
  Example: style={{ shadowColor:'#000', shadowOffset:{width:0,height:2},
                    shadowOpacity:0.08, shadowRadius:12, elevation:4 }}

Fonts:
  System default only (SF Pro on iOS, Roboto on Android)
  No expo-font loading required

Back navigation:
  iOS: swipe right (handled by Expo Router native stack)
  Android: hardware back button (handled by Expo Router)
  Do NOT implement custom back handling

Status bar:
  <StatusBar style="auto" /> from expo-status-bar in root layout
  NEVER import StatusBar from react-native

Notifications permission:
  Request on Profile screen mount: Notifications.requestPermissionsAsync()
  Handle both granted and denied gracefully (no crash if denied)
```

---

## COMPONENT LOADING STATES

Every screen that fetches data must implement all 3 states:

1. **Skeleton state** (`isPending === true`)
   - Use `<Skeleton>` component with `useShimmer()` animation
   - ProductGrid skeleton: 6 cards in same 2-column layout
   - ProductDetail skeleton: full-height image placeholder + 3 text lines

2. **Error state** (`isError === true`)
   - Use `<EmptyState>` with AlertCircle icon
   - Title: "Something went wrong"
   - Action button: "Try again" calls `refetch()`

3. **Empty state** (`data.length === 0`)
   - Use `<EmptyState>` with relevant icon
   - ProductGrid: SearchX icon + "No products found"
   - Cart: ShoppingBag icon + "Browse Collection" CTA

---

## ERROR BOUNDARY

```tsx
// src/components/layout/ErrorBoundary.tsx — class component
class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) {
      return (
        <View>
          <Typography variant="heading2">Something went wrong</Typography>
          <Button onPress={() => this.setState({ hasError: false })}>Reload</Button>
        </View>
      )
    }
    return this.props.children
  }
}
```
Wrap root Stack in app/_layout.tsx with `<ErrorBoundary>`.

