# GBTL — Project Memory

## What this is
React Native fashion e-commerce app. Expo SDK 54. iOS 15+ and Android 12+. Frontend only (mock data).

## Brand
Name: GBTL. Accent: #E8401C. Background: #F5F5F5. Surface: #FFFFFF. Text: #111111. Muted: #888888. Border: #E0E0E0.

## Stack (never substitute versions)
- expo ~54.0.34 + react-native 0.81.5 + expo-router ~6.0.23
- nativewind ^4.2.6 + tailwindcss ^3.4.19 (MUST be v3 — NOT tailwindcss v4)
- react-native-reanimated ~4.1.1 + react-native-gesture-handler ~2.28.0
- react-native-svg 15.12.1 (exact — lucide peer dep)
- @tanstack/react-query ^5.101.1
- zustand ^5.0.14
- react-hook-form ^7.80.0 + @hookform/resolvers ^5.4.0 + zod ^3.25.76
- lucide-react-native ^1.21.0
- expo-image ~3.0.11 | expo-secure-store ~15.0.8 | expo-blur ~15.0.8
- expo-notifications ~0.32.17 | expo-updates ~29.0.18 | expo-splash-screen ~31.0.13
- @gorhom/bottom-sheet ^5.2.14

## Hard rules — never break these
- `import 'react-native-gesture-handler'` must be line 1 of app/_layout.tsx
- babel plugins order: nativewind/babel first, reanimated/plugin LAST
- Never use AsyncStorage for tokens — always expo-secure-store
- Never hardcode colors — always NativeWind className from tailwind.config
- Never use raw <Text> — always <Typography variant="...">
- Never use RN core Animated API — always react-native-reanimated
- Never hardcode safe area padding — always useSafeAreaInsets()
- Shadows: always define both iOS (shadowColor etc) and Android (elevation)
- KeyboardAvoidingView: behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
- Bottom tab: BlurView on iOS, solid #FFFFFF on Android

## v5 API rules (breaking changes — builders MUST follow)
- Zustand v5: `const useStore = create<StoreType>()((set, get) => ({...}))` — double `()()` required for TS
- TanStack Query v5: `useQuery({ queryKey: ['key', var], queryFn: () => fn(var) })` — object syntax, NOT array+fn
- TanStack Query v5: use `isPending` instead of `isLoading` for initial load state
- @gorhom/bottom-sheet v5: `useBottomSheetModal()` hook available; `BottomSheetModalProvider` wraps app root

## Architecture rules
- Compound components: ProductCard.Root/Image/Body/Footer, Carousel.Root/Slide/Thumbnails, Field.Root/Label/Input/Error
- Slot pattern for Button: leftIcon/rightIcon props accept LucideIcon
- All business logic in hooks/services — components only render
- TanStack Query for server state (products), Zustand for client state (cart, wishlist, auth)
- Auth token lives ONLY in SecureStore — never in Zustand state
- Max 150 lines per screen file

## Typography scale (all from tailwind.config — never arbitrary sizes)
display=40/700, heading1=28/700, heading2=22/600, heading3=18/600,
body=15/400, body-sm=13/400, caption=11/500, price=20/700

## Animation tokens (src/lib/animations.ts)
Duration: fast=150ms, base=250ms, slow=400ms, lazy=600ms
Presets: useFadeInUp, useScaleIn, useSlideInRight, useStagger,
         usePressScale, useCartBounce, useShimmer, useParallax

## File structure
app/(auth)/login.tsx | app/(tabs)/index|collection|cart|profile.tsx
app/product/[id].tsx | app/_layout.tsx
src/components/ui/ | src/components/product/ | src/components/cart/
src/components/forms/ | src/components/layout/
src/hooks/ | src/store/ | src/services/ | src/lib/ | src/schemas/
src/types/index.ts | src/data/mockProducts.ts | src/constants/tokens.ts

## Every screen must have
1. Skeleton state (isLoading) with shimmer
2. Error state (isError) with EmptyState + refetch button
3. Empty state (data=[]) with EmptyState + CTA

## Build system
- Trigger: say "start the GBTL build" to invoke the orchestrator agent
- Orchestrator reads tasks/status.md → dispatches builders in parallel per wave → reviewer → tester → next wave
- Primary spec: GBTL_Prompt_v4.md | Hard rules: CLAUDE.md | Task checklists: tasks/waveN/*.md
- Agents: orchestrator (opus, Agent+Read+Write+Bash), builder (sonnet, Read+Write+Bash+Glob), reviewer (sonnet, Read+Grep+Glob), tester (sonnet, Read+Grep+Glob+Bash)
