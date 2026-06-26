# Wave 3 / Task D — Layout Components

## Spec source
- `## CROSS-PLATFORM RULES` (lines 529–567) — SafeArea, KeyboardAvoidingView, BlurView, Platform rules
- `## DESIGN PATTERNS` (lines 287–293) — ScreenWrapper render prop pattern
- `## ERROR BOUNDARY` (lines 594–599) — class component spec

## Files to generate

1. `src/components/layout/ErrorBoundary.tsx`
   - Class component with `getDerivedStateFromError` and `componentDidCatch`
   - When hasError: View centered with Typography heading3 "Something went wrong" + Button outline "Try again" that calls `this.setState({ hasError: false })`
   - No expo imports needed — pure React

2. `src/components/layout/ScreenWrapper.tsx`
   - Props: `children: (args: { scrollY: SharedValue<number> }) => React.ReactNode`, `scrollable?: boolean`, `header?: React.ReactNode`
   - Uses `useSafeAreaInsets()` for top/bottom padding — never hardcode
   - `KeyboardAvoidingView` with `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`
   - If `scrollable`: Animated ScrollView (reanimated) with `onScroll` updating scrollY SharedValue
   - If not scrollable: regular View, scrollY stays at 0

3. `src/components/layout/Header.tsx`
   - Props: `title?: string`, `showBack?: boolean`, `showCart?: boolean`, `transparent?: boolean`
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
