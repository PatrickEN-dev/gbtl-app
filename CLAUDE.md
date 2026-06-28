# GBTL — Project Memory

## What this is

React Native fashion e-commerce app. **Expo SDK 54**, iOS 15+ / Android 12+. Frontend complete; backend = mock data + Stripe Payment Sheet wired to a placeholder serverless endpoint. See [README.md](./README.md), [SETUP.md](./SETUP.md), [PLAY_STORE_LAUNCH.md](./PLAY_STORE_LAUNCH.md), [IMPROVEMENTS.md](./IMPROVEMENTS.md), [INSTALL_DEPS.md](./INSTALL_DEPS.md).

## Env / config flow

- All external IDs and keys live in `.env` (gitignored) — copy `.env.example` and replace mock values.
- `app.config.ts` reads from `process.env.EXPO_PUBLIC_*` and forwards to `expo.extra`.
- Code reads via `env` object from `src/lib/env.ts` — DO NOT use `Constants.expoConfig.extra` directly.
- `isMockValue()` from `env.ts` detects placeholder values — services skip real calls when mocks detected and gracefully fall back to mock data / noop.

## Brand

Name: GBTL. Theme: moss green + white. Tokens auto-switch via CSS variables defined in `global.css` (light defaults + `.dark` override). Dark mode is opt-in (toggle via NativeWind's `useColorScheme().setColorScheme('dark' | 'light' | 'system')`) — defaults to system.

Light: bg=#F8F8F3, surface=#FFFFFF, primary=#1A2018, accent=#5C7C5F (moss green), muted=#8E948B, border=#E5E5E0.
Dark: bg=#1A1F1B, surface=#252A26, primary=#F5F5F2, accent=#8FB088, muted=#9C9F95, border=#3A3F3B.

NEVER hardcode these — always use `bg-bg / bg-surface / text-primary / bg-accent / text-muted / border-border` className tokens; they resolve via CSS vars and swap automatically with dark mode. For JS-side values (lucide `color={}`, RN `shadowColor`), import `useThemeColors()` from `@/hooks/useThemeColors` — it returns the right palette for the current scheme.

## Stack (never substitute versions)

- expo ~54.0.34 + react-native 0.81.5 + react 19.1.0 + expo-router ~6.0.24
- nativewind ^4.2.6 + tailwindcss ^3.4.19 (MUST be v3 — NOT tailwindcss v4)
- react-native-reanimated ~4.1.1 + react-native-gesture-handler ~2.28.0 + react-native-worklets 0.5.1
- react-native-svg 15.12.1 (exact — lucide peer dep)
- @tanstack/react-query ^5.101.1
- zustand ^5.0.14
- react-hook-form ^7.80.0 + @hookform/resolvers ^5.4.0 + zod ^3.25.76
- lucide-react-native ^1.21.0
- expo-image ~3.0.11 | expo-secure-store ~15.0.8 | expo-blur ~15.0.8
- expo-updates ~29.0.18 | expo-splash-screen ~31.0.13 | expo-localization ~17.0.9
- @gorhom/bottom-sheet ^5.2.14
- @stripe/stripe-react-native 0.50.3 (Payment Sheet)
- expo-auth-session ~7.0.11 + expo-web-browser ~15.0.11 (Google Sign-In)
- i18next ^26.3.3 + react-i18next ^17.0.8 (EN + pt-BR)
- @react-native-async-storage/async-storage 2.2.0 (installed; not yet used for persist)

## Hard rules — never break these

- `import 'react-native-gesture-handler'` must be line 1 of app/_layout.tsx
- babel plugins order: `babel-preset-expo` with `jsxImportSource: 'nativewind'`, plus `react-native-reanimated/plugin` LAST
- Never use AsyncStorage for auth tokens — always expo-secure-store
- Never hardcode colors — always NativeWind className tokens from tailwind.config (CSS-var-backed)
- Never use raw <Text> — always <Typography variant="...">
- Never use RN core Animated API — always react-native-reanimated
- Never hardcode safe area padding — always useSafeAreaInsets()
- Shadows: always define both iOS (shadowColor etc) and Android (elevation)
- KeyboardAvoidingView: behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
- Bottom tab: BlurView on iOS, solid on Android (use `bg-surface` token)
- All external secrets/IDs live in `app.json → expo.extra` (read via `Constants.expoConfig.extra`) — never inline in code

## v5 API rules (breaking changes — builders MUST follow)

- Zustand v5: `const useStore = create<StoreType>()((set, get) => ({...}))` — double `()()` required for TS
- TanStack Query v5: `useQuery({ queryKey: ['key', var], queryFn: () => fn(var) })` — object syntax, NOT array+fn
- TanStack Query v5: use `isPending` instead of `isLoading` for initial load state
- @gorhom/bottom-sheet v5: `BottomSheetModalProvider` wraps the app root (in app/_layout.tsx); use `BottomSheetModal` + ref, NOT `BottomSheet`
- expo-router v6: route groups `(name)` are silent; `Stack.Screen` registration in `_layout.tsx`

## Architecture rules

- Compound components: `ProductCard.Root/Image/Body/Footer`, `ImageCarousel.Root/Slide/SideThumbnails`, `Field.Root/Label/Input/Error`
- Slot pattern for Button: leftIcon/rightIcon props accept any ReactNode (typically LucideIcon)
- All business logic in hooks/services — components only render
- TanStack Query for server state (products), Zustand for client state (cart, wishlist, auth profile, cart UI sheet)
- Auth token lives ONLY in SecureStore — never in Zustand state. Profile (non-sensitive) OK in Zustand.
- Max 150 lines per screen file
- Cart is a **global BottomSheetModal** mounted once in [app/_layout.tsx](app/_layout.tsx); opened/closed via `useCartUI()` (Zustand) which calls a ref on `BottomSheetModal`

## Typography scale (all from tailwind.config — never arbitrary sizes)

display=40/700, heading1=28/700, heading2=22/600, heading3=18/600,
body=15/400, body-sm=13/400, caption=11/500, price=20/700

## Animation tokens (src/lib/animations.ts)

Duration: fast=150ms, base=250ms, slow=400ms, lazy=600ms
Spring: Spring.snappy, Spring.gentle
Presets: useFadeInUp, useScaleIn, useSlideInRight, useStagger,
usePressScale, useCartBounce, useShimmer, useParallax

## File structure (current state)

```
app/
  _layout.tsx                 # Providers: ErrorBoundary, GH, SafeArea, Query, Stripe, BottomSheetModal
                              # AppInitializer: restoreSession, initMonitoring, initAnalytics, registerForPushNotifications
  index.tsx                   # Redirect → /(tabs)
  +not-found.tsx
  onboarding.tsx
  privacy.tsx, terms.tsx, delete-account.tsx
  wishlist.tsx
  settings.tsx                # User profile + preferences + access to orders/addresses/wishlist
  product/[id].tsx
  orders/                     index.tsx (list), [id].tsx (detail)
  addresses/                  index.tsx (list), new.tsx (create/edit with ViaCEP lookup)
  (auth)/_layout.tsx, login.tsx
  (tabs)/_layout.tsx, index.tsx (home), collection.tsx, cart.tsx (opens sheet)

src/
  components/
    ui/        Button, Typography, Skeleton, SearchBar, EmptyState, ThemeToggle, QuantityStepper, Divider, Badge
    primitives/ Card, IconButton, Pill
    layout/    Header, TabBar, ScreenWrapper, ErrorBoundary
    product/   ProductCard/, ProductGrid, ImageCarousel/, ColorSwatch, SizeSelector, FiltersSheet, ReviewsSection
    cart/      CartItem, CompactCartItem, CartSummary, CartBottomSheet
    forms/     Field/ (used by addresses/new.tsx)
  hooks/       useAuth, useCart, useWishlist, useProduct, useProducts, useOrders, useReviews,
               useThemeColors, useBottomSheet, useOnboarding
  store/       cartStore, wishlistStore, authStore, cartUIStore, ordersStore,
               addressesStore, couponStore, themeStore (all Zustand; persistent ones use AsyncStorage via persist middleware)
  services/    products, googleAuth, stripe, notifications, orders, addresses (ViaCEP), coupons, reviews
  lib/         env, i18n, queryClient, secureStore, animations, logger, monitoring (Sentry shim),
               analytics (PostHog shim), api (centralized fetch wrapper), format
  schemas/     address.schema.ts (Zod) — checkout schema removed (Stripe Payment Sheet handles it)
  locales/     en.json, pt-BR.json
  data/        mockProducts.ts (replace with API)
  constants/   tokens.ts
  types/       index.ts (Product, Order, Address, Coupon, ProductReview, …), external-stubs.d.ts
```

## Routing map

- `/` → redirect to `/(tabs)`
- `/(tabs)/index` → Home (search, categories, grid)
- `/(tabs)/collection` → All products with sort
- `/(tabs)/cart` → opens CartBottomSheet then `router.replace('/(tabs)')`
- `/(auth)/login` → presented as modal
- `/product/[id]` → detail (image carousel, color, size, qty, add/buy)
- `/wishlist` → favorites
- `/onboarding` → first launch
- `/privacy`, `/terms`, `/delete-account` → legal screens

## State stores (Zustand)

- `cartStore` — items[], add/remove/update/clear. **Not persisted** (TODO: zustand/persist + AsyncStorage)
- `wishlistStore` — ids[], toggle/clear/isWishlisted. **Not persisted** (same TODO)
- `authStore` — user profile + isAuthenticated + isLoading
- `cartUIStore` — open()/close() that calls the BottomSheetModal ref (`cartSheetRef`)

## Every screen must have

1. Skeleton state (isPending) with shimmer ← TanStack v5: isPending not isLoading
2. Error state (isError) with EmptyState + refetch button
3. Empty state (data=[]) with EmptyState + CTA

## External config (app.json → expo.extra)

All `PLACEHOLDER_*` must be replaced before production:

- `googleClientIdIos/Android/Web` — Google OAuth 2.0 client IDs
- `stripePublishableKey` — Stripe pk_test_/pk_live_
- `stripeMerchantId` — Apple Pay merchant identifier
- `stripePaymentEndpoint` — serverless URL that creates PaymentIntent (Stripe Secret Key lives there, never in app)
- `expoProjectId` — for push tokens (from `eas init`)

Read via `Constants.expoConfig?.extra` (see [src/services/stripe.ts](src/services/stripe.ts), [src/services/googleAuth.ts](src/services/googleAuth.ts)).

## Known limitations / TODO before production

1. **Mock products** — `services/products.ts` falls back to `mockProducts.ts` when `useMockData=true` OR when the API errors. Set `EXPO_PUBLIC_USE_MOCK_DATA=false` and `EXPO_PUBLIC_API_URL` to a real backend.
2. **Stripe endpoint not deployed** — `stripePaymentEndpoint` is mock; checkout returns "Stripe não configurado" until you deploy serverless and set `EXPO_PUBLIC_STRIPE_PAYMENT_ENDPOINT`.
3. **Push, Sentry, PostHog** — code is wired but deps are opt-in. Install per [INSTALL_DEPS.md](./INSTALL_DEPS.md) and replace mock env values to activate.
4. **Legal screens are placeholders** — privacy.tsx, terms.tsx, delete-account.tsx need real legal content reviewed by counsel.
5. **Asset placeholders** — `assets/images/icon.png`, `splash-icon.png`, `android-icon-*` are Expo template defaults; replace before release.
6. **No unit tests** — Jest not configured. E2E smoke flows are in `.maestro/`.
7. **Auth: no token refresh** — Google access_token expires; user re-logs in. OK for MVP.
8. **No real product images** — mock catalog uses Unsplash URLs; host on Cloudinary/CDN before launch.

## Build system

- Trigger: say "start the GBTL build" to invoke the orchestrator agent
- Orchestrator reads sdd/tasks/status.md → dispatches builders in parallel per wave → reviewer → tester → linker → next wave
- After wave 1: MANDATORY `npm install --legacy-peer-deps` before wave 2
- After wave 5: MANDATORY `npx tsc --noEmit` before marking complete
- SDD folder: sdd/specs/ (design docs) | sdd/tasks/ (wave tasks + contracts + agent tools) | sdd/meta/ (reference prompt)
- Support files: sdd/tasks/shared-imports.md | sdd/tasks/reviewer-checklist.md | sdd/tasks/tester-commands.md
- Agents: orchestrator (Agent+Read+Write+Bash), builder (Read+Write+Bash+Glob), reviewer (Read+Grep+Glob+Bash), tester (Read+Grep+Glob+Bash), linker (Read+Grep+Glob+Bash)

## Useful commands

```bash
npm start                              # Metro
npx expo start --clear                 # clear cache (after changing tokens/native config)
npx tsc --noEmit                       # type-check
npm run lint                           # expo lint
npx expo prebuild                      # generate /ios /android (debug only)
eas build --platform android --profile production
eas update --branch production         # OTA update
```
