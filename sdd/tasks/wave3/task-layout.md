# Wave 3 / Task D — Layout Components

## Spec source
Read `sdd/specs/screens.md` — contains `## CROSS-PLATFORM RULES` (SafeArea, KeyboardAvoidingView, BlurView, Platform rules) and `## ERROR BOUNDARY` (class component spec).
Read `sdd/specs/design.md` — contains `## DESIGN PATTERNS` (ScreenWrapper render prop pattern).

## Files to generate

1. `src/components/layout/ErrorBoundary.tsx`
   - Class component with `getDerivedStateFromError` and `componentDidCatch`
   - When hasError: View centered with Typography heading3 "Something went wrong" + Button outline "Try again" that calls `this.setState({ hasError: false })`
   - No expo imports needed — pure React

2. `src/components/layout/ScreenWrapper.tsx`
   - Props: `children: React.ReactNode | ((args: { scrollY: SharedValue<number> }) => React.ReactNode)`, `scrollable?: boolean`, `header?: React.ReactNode`, `className?: string`
   - Uses `useSafeAreaInsets()` for top/bottom padding — never hardcode
   - `KeyboardAvoidingView` with `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`
   - If `scrollable=true`: children MUST be a render prop → call as `children({ scrollY })` using Reanimated ScrollView with `onScroll`
   - If `scrollable=false` or omitted: children is plain ReactNode → render directly, scrollY SharedValue stays at 0

   **Usage examples — implement BOTH call patterns:**
   ```tsx
   // Pattern A: non-scrollable (login, not-found, profile screens)
   <ScreenWrapper>
     <View className="flex-1 px-6">...</View>
   </ScreenWrapper>

   // Pattern B: scrollable with header (home, collection screens)
   <ScreenWrapper scrollable header={<Header title="Collection" />}>
     {({ scrollY }) => (
       <ProductGrid animatedScrollY={scrollY} />
     )}
   </ScreenWrapper>
   ```

3. `src/components/layout/Header.tsx`
   - Props: `title?: string`, `showBack?: boolean`, `showCart?: boolean`, `transparent?: boolean`, `rightElement?: React.ReactNode`
   - `rightElement` renders any node on the right side (e.g., ProductDetail uses it for the wishlist heart button)
   - Uses `useSafeAreaInsets()` for top padding
   - Back button: ChevronLeft lucide icon, `usePressScale(0.9)`, `router.back()`
   - Cart icon: ShoppingBag lucide, badge from `useCart().totalItems` if > 0
   - transparent: no background, absolute position, white icons

4. `src/components/layout/TabBar.tsx`
   - Receives `BottomTabBarProps` from `@react-navigation/bottom-tabs`
   - iOS: `<BlurView intensity={80} tint="light">` background
   - Android: solid `bg-surface` (white)
   - Each tab: `usePressScale(0.9)` on press, Lucide icon (Home/Grid/ShoppingBag/User), label Typography caption
   - Cart tab: shows Badge with totalItems from useCart() if > 0
   - Active tab icon: `text-accent` | inactive: `text-muted`
