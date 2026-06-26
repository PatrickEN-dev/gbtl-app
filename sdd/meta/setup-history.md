# GBTL — SDD Architecture Setup

## Your job
You are running inside a fresh Expo project directory.
Create the entire multi-agent SDD architecture below.
Do not build the app yet — build the system that builds the app.
Create every file exactly as specified. No stubs.

---

## Step 1 — Create directories

```bash
mkdir -p .claude/agents
mkdir -p tasks/wave1 tasks/wave2 tasks/wave3 tasks/wave4 tasks/wave5
```

---

## Step 2 — Create CLAUDE.md (project root)

```markdown
# GBTL — Project Memory

## Stack (exact versions — never substitute)
expo ~51.0.0 | expo-router ^3.5.0 | react-native 0.74.0
react-native-reanimated ~3.10.0 | react-native-gesture-handler ~2.16.0
react-native-safe-area-context 4.10.0 | react-native-screens ~3.31.0
react-native-svg 15.2.0 | nativewind ^4.0.36 | tailwindcss ^3.4.0
zustand ^4.5.0 | @tanstack/react-query ^5.40.0
react-hook-form ^7.51.0 | @hookform/resolvers ^3.4.0 | zod ^3.23.0
lucide-react-native ^0.378.0 | expo-image ~1.12.0 | expo-secure-store ~13.0.0
expo-blur ~13.0.0 | expo-notifications ~0.28.0 | expo-updates ~0.25.0
expo-splash-screen ~0.27.0 | @gorhom/bottom-sheet ^4.6.0

## Brand tokens
accent:#E8401C | bg:#F5F5F5 | surface:#FFFFFF | primary:#111111 | muted:#888888 | border:#E0E0E0

## Absolute rules
- app/_layout.tsx line 1: `import 'react-native-gesture-handler'`
- babel plugins: nativewind/babel first, reanimated/plugin LAST
- Auth token: expo-secure-store ONLY — never AsyncStorage, never Zustand state
- Styling: NativeWind className ONLY — never StyleSheet.create, never hardcoded hex
- Text: `<Typography variant="...">` ONLY — never raw `<Text>`
- Animations: react-native-reanimated ONLY — never RN core Animated
- Safe area: useSafeAreaInsets() ONLY — never hardcoded padding
- Shadows: always both iOS shadow props AND Android elevation
- KeyboardAvoidingView: `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`
- Bottom tab: expo-blur iOS | solid #FFFFFF Android
- Max 150 lines/screen | Max 200 lines/component

## Patterns
- Compound: ProductCard.Root/Image/Body/Footer | Carousel.Root/Slide/Thumbnails | Field.Root/Label/Input/Error
- Slot: Button leftIcon/rightIcon as React.ReactNode
- State: TanStack Query → server data | Zustand → cart/wishlist/auth user | SecureStore → JWT

## Typography scale
display=40/700 | heading1=28/700 | heading2=22/600 | heading3=18/600
body=15/400 | body-sm=13/400 | caption=11/500 | price=20/700

## Animation hooks (src/lib/animations.ts)
useFadeInUp | useScaleIn | useSlideInRight | useStagger
usePressScale | useCartBounce | useShimmer | useParallax
Duration: fast=150 | base=250 | slow=400 | lazy=600

## Every data screen needs
1. isLoading → `<Skeleton>` shimmer  2. isError → `<EmptyState>` + refetch  3. empty → `<EmptyState>` + CTA
```

---

## Step 3 — Create .claude/agents/orchestrator.md

```markdown
---
name: orchestrator
description: GBTL build coordinator. Reads tasks/ folder, dispatches builder subagents in parallel per wave, then calls reviewer and tester before advancing. Invoke with "start the GBTL build" or "resume wave N".
tools: Read, Write, Bash
model: opus
---

You coordinate the GBTL React Native app build. You do not write app code.

## On every invocation
1. Read `tasks/status.md` — find current wave (create with Wave 1 pending if missing)
2. Read `CLAUDE.md` for project rules
3. Execute current wave protocol

## Wave protocol
Step 1 — Read all task files in `tasks/waveN/`. Dispatch one @builder subagent per task file simultaneously.
Step 2 — After ALL builders complete, invoke @reviewer. Pass: list of files just generated.
Step 3 — After reviewer approves, invoke @tester. Pass: all generated files so far.
Step 4 — PASSED: update status.md → start next wave. FAILED: dispatch @builder to fix flagged files → re-run @reviewer → re-run @tester.

## Wave order
1→Foundation | 2→State+Hooks | 3→UI Primitives | 4→Feature Components | 5→Screens

## Status format (append to tasks/status.md after each wave)
`## Wave N — COMPLETE|FAILED | Files: [list] | Reviewer: APPROVED|REJECTED | Tester: PASSED|FAILED`

## Start
Read tasks/status.md. Begin current wave.
```

---

## Step 4 — Create .claude/agents/builder.md

```markdown
---
name: builder
description: GBTL code generator. Receives a task file path, generates complete TypeScript/TSX files and writes them to disk. Invoked by orchestrator for each wave task.
tools: Read, Write, Bash, Glob
model: sonnet
---

You generate complete, production-ready code for the GBTL React Native app.

## On invocation
1. Read the task file path given to you
2. Read `CLAUDE.md`
3. Generate every file in the task — completely, no stubs, no TODOs
4. Write each file to disk at the exact path specified
5. Output: `✓ BUILDER DONE: [task] | Files: [list]`

## Non-negotiable (from CLAUDE.md)
- First line of every file: `// [exact/file/path.tsx]`
- NativeWind className only — no StyleSheet.create, no hardcoded hex
- `<Typography variant="...">` only — no raw `<Text>`
- react-native-reanimated only — no Animated from react-native
- expo-secure-store only — no AsyncStorage
- Animation hooks from src/lib/animations.ts — no inline useSharedValue
- useSafeAreaInsets() only — no hardcoded padding
- Both iOS shadow props AND Android elevation on every shadow
- Screen ≤150 lines | Component ≤200 lines
```

---

## Step 5 — Create .claude/agents/reviewer.md

```markdown
---
name: reviewer
description: GBTL code reviewer. Read-only audit of generated files against CLAUDE.md rules. Invoked by orchestrator after each build wave.
tools: Read, Grep, Glob
model: sonnet
---

You audit generated files. You never write or modify code.

## REJECT wave if any critical issue found
- Raw `<Text>` usage (must be `<Typography>`)
- `StyleSheet.create` in component/screen files
- Hardcoded hex colors outside tailwind.config.js
- `import { Animated } from 'react-native'`
- `import AsyncStorage`
- `token` field in authStore state
- app/_layout.tsx line 1 is not `import 'react-native-gesture-handler'`
- reanimated/plugin is not last in babel.config.js
- Hardcoded safe area padding numbers

## Flag as WARNING (approve wave, note for next cycle)
- Screen >150 lines | Component >200 lines
- Business logic in screen component
- Data screen missing loading/error/empty state
- Animation using useSharedValue directly (should use hooks from animations.ts)

## Output
```
=== REVIEWER — Wave N ===
CRITICAL: [file]: [issue]
WARNINGS: [file]: [issue]
VERDICT: APPROVED | REJECTED ([files to fix])
=== END ===
```
```

---

## Step 6 — Create .claude/agents/tester.md

```markdown
---
name: tester
description: GBTL cross-file consistency tester. Static analysis across all generated files — imports, types, exports, navigation paths. Invoked by orchestrator after reviewer approves.
tools: Read, Grep, Glob, Bash
model: sonnet
---

You validate that all generated files work together. No code written. Static analysis only.

## Checks

### Imports — every import path resolves to an existing generated file. No circular imports.

### Type consistency
- CartItem same interface in: cartStore, useCart, CartItem component
- Product same interface in: ProductCard, ProductGrid, useProducts
- AuthUser same interface in: authStore, useAuth, profile screen

### Store contracts
- cartStore exports: items, addItem, removeItem, updateQuantity, clearCart, selectors
- wishlistStore exports: toggle, isWishlisted, selectCount
- authStore exports: user, isAuthenticated, setUser, clearUser — NO token field

### Animation contracts — src/lib/animations.ts exports all 8 hooks:
useFadeInUp | useScaleIn | useSlideInRight | useStagger | usePressScale | useCartBounce | useShimmer | useParallax

### Compound contracts
- ProductCard: Root,Image,Body,Name,Price,Footer,WishlistButton all exported
- ImageCarousel: Root,Slide,Thumbnails,Dots all exported
- Field: Root,Label,Input,Error all exported

### Navigation — all router.push/replace paths exist in app/

## Output
```
=== TESTER — Wave N ===
IMPORT ISSUES: [details]
TYPE ISSUES: [details]
CONTRACT ISSUES: [details]
VERDICT: PASSED | FAILED ([files to fix])
=== END ===
```
```

---

## Step 7 — Create task files

### tasks/wave1/task-configs.md
```markdown
# Wave 1 / Task A — Config Files
Read CLAUDE.md for exact versions and brand tokens.

1. `package.json` — all deps from CLAUDE.md exact versions, scripts: start/android/ios/build/lint
2. `babel.config.js` — presets:babel-preset-expo | plugins:[nativewind/babel, reanimated/plugin LAST]
3. `tailwind.config.js` — withNativeWind, nativewind/preset, full color+fontSize+borderRadius+shadow from CLAUDE.md
4. `metro.config.js` — withNativeWind wrapper, input:./global.css
5. `global.css` — @tailwind base/components/utilities
6. `app.json` — name:GBTL slug:gbtl-app scheme:gbtl portrait splash:#E8401C ios:com.gbtl.app supportsTablet:false android:com.gbtl.app plugins:[expo-router,expo-font,expo-secure-store,expo-notifications{color:#E8401C},expo-updates] typedRoutes:true
7. `tsconfig.json` — extends:expo/tsconfig.base strict:true paths:@/*→src/*
```

### tasks/wave1/task-types.md
```markdown
# Wave 1 / Task B — Types + Data Layer

1. `src/types/index.ts` — Product,ProductColor,ProductSize,CartItem,AuthUser interfaces
2. `src/constants/tokens.ts` — TS consts mirroring CLAUDE.md: Colors,Duration,Spacing,Radius
3. `src/data/mockProducts.ts` — 12 products (4/category), picsum.photos/seed/gbtl-{id}/400/500, 3 colors, 5 sizes (1 unavailable), $80–$280, 3 isSale+originalPrice, 3 isNew, ratings 3.8–5.0
4. `src/services/products.ts` — fetchProducts(category?):Promise<Product[]> 300ms | fetchProduct(id):Promise<Product> 300ms throws if missing
5. `src/services/auth.ts` — login(email,password):Promise<{user,token}> 500ms any creds | logout() | refreshToken() 200ms
```

### tasks/wave1/task-lib.md
```markdown
# Wave 1 / Task C — Core Libraries

1. `src/lib/queryClient.ts` — staleTime:300000, retry:1, refetchOnWindowFocus:false
2. `src/lib/secureStore.ts` — TOKEN_KEY='gbtl_auth_token', getToken/setToken/deleteToken with try/catch
3. `src/lib/animations.ts` — Duration+Spring consts + all 8 hooks (useFadeInUp,useScaleIn,useSlideInRight,useStagger,usePressScale,useCartBounce,useShimmer,useParallax) using Reanimated v3
4. `src/schemas/login.schema.ts` — z.object({email:z.string().email(),password:z.string().min(6)}), LoginFormData type
5. `src/schemas/checkout.schema.ts` — fullName min2, address min5, city min2, cardNumber 16 digits, expiry MM/YY, cvv 3 digits, CheckoutFormData type
```

### tasks/wave2/task-stores.md
```markdown
# Wave 2 / Task A — Zustand Stores

1. `src/store/cartStore.ts` — items:CartItem[], addItem/removeItem/updateQuantity/clearCart, selectors: totalItems/subtotal/deliveryFee(free>$200)/total
2. `src/store/wishlistStore.ts` — ids:Set<string> (handle correctly in Zustand), toggle/clear/isWishlisted/selectCount
3. `src/store/authStore.ts` — user:AuthUser|null, isAuthenticated, isLoading — NO token field — setUser/clearUser/setLoading
```

### tasks/wave2/task-hooks.md
```markdown
# Wave 2 / Task B — Custom Hooks

1. `src/hooks/useProducts.ts` — useQuery(['products',category], fetchProducts(category))
2. `src/hooks/useProduct.ts` — useQuery(['product',id], fetchProduct(id), enabled:!!id)
3. `src/hooks/useCart.ts` — cartStore selectors + all actions
4. `src/hooks/useWishlist.ts` — wishlistStore selectors + toggle/isWishlisted
5. `src/hooks/useAuth.ts` — login(setLoading→login→setToken→setUser), logout(clearUser→deleteToken→queryClient.clear), restoreSession(getToken→setUser if exists)
6. `src/hooks/useBottomSheet.ts` — ref:BottomSheetModal, present(), dismiss()
```

### tasks/wave3/task-ui-base.md
```markdown
# Wave 3 / Task A — Base UI Components

1. `src/components/ui/Typography.tsx` — Variant:display|heading1|heading2|heading3|body|body-sm|caption|price, Color:primary|muted|accent|white|error, animated? uses Reanimated Animated.Text
2. `src/components/ui/Button.tsx` — Variant:primary|outline|ghost, Size:sm|md|lg, leftIcon/rightIcon, loading, usePressScale(0.96) internally
3. `src/components/ui/Badge.tsx` — variant accent|success|warning|error|neutral, size sm|md, rounded-full
4. `src/components/ui/Divider.tsx` — horizontal/vertical, bg-border
5. `src/components/ui/EmptyState.tsx` — icon:LucideIcon 48px, title heading3, description body-sm, action Button outline, useScaleIn on mount
```

### tasks/wave3/task-ui-skeleton.md
```markdown
# Wave 3 / Task B — Skeleton

1. `src/components/ui/Skeleton.tsx`
   - Skeleton: width,height,borderRadius=8 → Animated.View useShimmer() bg-border
   - SkeletonGroup: children+gap View wrapper
   - ProductCardSkeleton: image 100%×200 + name 70%×16 + price 40%×14
   - ProductDetailSkeleton: image full×400 + name 60%×24 + price 30%×20 + 3 text lines
```

### tasks/wave3/task-layout.md
```markdown
# Wave 3 / Task C — Layout Components

1. `src/components/layout/ErrorBoundary.tsx` — class component, getDerivedStateFromError, error UI with retry Button
2. `src/components/layout/ScreenWrapper.tsx` — scrollable render-prop(scrollY SharedValue), useSafeAreaInsets, KeyboardAvoidingView per Platform.OS
3. `src/components/layout/Header.tsx` — title,showBack,showCart,transparent — cartStore badge, usePressScale on back
4. `src/components/layout/TabBar.tsx` — BottomTabBarProps, iOS:BlurView / Android:solid, usePressScale each tab, cart Badge, lucide icons
```

### tasks/wave4/task-product-card.md
```markdown
# Wave 4 / Task A — ProductCard + Grid

1. `src/components/product/ProductCard/index.tsx` — Compound: Root(useFadeInUp+usePressScale)/Image(expo-image 3:4)/Body/Name/Price(sale logic)/Footer/WishlistButton(heart spring)/NewBadge/SaleBadge
2. `src/components/product/ProductGrid.tsx` — FlatList numColumns=2, Skeleton while loading, staggerIndex, RefreshControl
3. `src/components/product/ColorSwatch.tsx` — 28px circles, accent ring on selected, spring press, name label
4. `src/components/product/SizeSelector.tsx` — pill chips, bg-primary selected, opacity-40 unavailable, withTiming transition
```

### tasks/wave4/task-product-detail.md
```markdown
# Wave 4 / Task B — ImageCarousel

1. `src/components/product/ImageCarousel/index.tsx` — Compound: Root(GestureDetector pan+snap)/Slide(expo-image+useSlideInRight)/Thumbnails(FlatList 60×60)/Dots(animated width)
```

### tasks/wave4/task-cart-forms.md
```markdown
# Wave 4 / Task C — Cart + Forms

1. `src/components/cart/CartItem.tsx` — Swipeable delete, useFadeInUp, thumbnail+info+qty controls
2. `src/components/cart/CartSummary.tsx` — subtotal/delivery/total from useCart, free delivery nudge
3. `src/components/forms/Field/index.tsx` — Compound: Root(useController context)/Label/Input(focus border)/Error(Reanimated height expand)
4. `src/components/forms/LoginForm.tsx` — RHF+loginSchema, Field compound, loading state, useAuth().login
5. `src/components/forms/CheckoutForm.tsx` — RHF+checkoutSchema, BottomSheetScrollView, sections, clearCart+dismiss on submit
```

### tasks/wave5/task-screens-auth.md
```markdown
# Wave 5 / Task A — Root + Auth Screens

1. `app/_layout.tsx` — LINE 1: import 'react-native-gesture-handler' — providers: ErrorBoundary→GestureHandlerRootView→SafeAreaProvider→QueryClientProvider→BottomSheetModalProvider→Stack — on mount: splash+restoreSession — StatusBar auto
2. `app/+not-found.tsx` — ScreenWrapper, EmptyState Home icon, router.replace('/(tabs)/')
3. `app/(auth)/_layout.tsx` — Redirect if isAuthenticated
4. `app/(auth)/login.tsx` — useScaleIn, GBTL display accent wordmark, LoginForm, guest link
```

### tasks/wave5/task-screens-tabs.md
```markdown
# Wave 5 / Task B — Tab Screens

1. `app/(tabs)/_layout.tsx` — TabBar component
2. `app/(tabs)/index.tsx` — scrollY SharedValue, ScreenWrapper render-prop, transparent Header, hero 500h useParallax, category chips Reanimated transition, ProductGrid useProducts
3. `app/(tabs)/collection.tsx` — Header, sort chips, useProducts filtered+sorted client-side
4. `app/(tabs)/cart.tsx` — CartItem FlatList, CartSummary sticky footer, CheckoutForm BottomSheetModal, EmptyState
5. `app/(tabs)/profile.tsx` — avatar useScaleIn, menu rows, notifications permission, logout with confirm Alert
```

### tasks/wave5/task-screens-product.md
```markdown
# Wave 5 / Task C — Product Detail Screen

1. `app/product/[id].tsx` — useLocalSearchParams id, useProduct+useCart+useWishlist, Skeleton/Error states, ScrollView, absolute transparent Header+wishlist, ImageCarousel full-bleed, rating row, ColorSwatch, SizeSelector, expandable description Reanimated maxHeight, sticky bottom Add to Cart usePressScale+useCartBounce
```

---

## Step 8 — Create tasks/status.md

```markdown
# GBTL Build Status
Current wave: 1
Status: PENDING

_Orchestrator updates this file after each wave._
```

---

## Step 9 — Verify

Run:
```bash
find .claude tasks CLAUDE.md -type f | sort
```

Expected: 4 agent files + 10 task files + status.md + CLAUDE.md = 16 files total.

Output when done:
```
✓ SDD STRUCTURE COMPLETE — 16 files
To build the app: claude (then type "start the GBTL build")
Or: export CLAUDE_CODE_SUBAGENT_MODEL=claude-sonnet-4-6 && claude
```

## Cost optimization tip
Set this env var before running the build to use Sonnet for builder/reviewer/tester subagents and Opus only for the orchestrator:
```bash
export CLAUDE_CODE_SUBAGENT_MODEL=claude-sonnet-4-6
```
