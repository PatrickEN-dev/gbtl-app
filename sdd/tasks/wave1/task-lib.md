# Wave 1 / Task C — Core Libraries

## Spec source
Read `sdd/specs/design.md` — contains:
- `## ANIMATION SYSTEM` — exact hook signatures, Duration/Spring/Easing consts, Reanimated v4 imports
- `## TYPOGRAPHY SYSTEM` — scale values (needed for tokens.ts)

Also read `sdd/specs/data.md` — contains:
- `## LIB FILES` — exact queryClient and secureStore implementations
- `## FORMS (Schemas)` — exact Zod schema code for login and checkout

## Files to generate

1. `src/lib/queryClient.ts`
   ```ts
   // TanStack Query v5: new QueryClient({ defaultOptions: { queries: { staleTime: 300000, retry: 1, refetchOnWindowFocus: false }}})
   ```

2. `src/lib/secureStore.ts`
   ```ts
   // TOKEN_KEY = 'gbtl_auth_token'
   // getToken(): Promise<string|null> — SecureStore.getItemAsync
   // setToken(token: string): Promise<void>
   // deleteToken(): Promise<void>
   // Wrap all in try/catch, return null on error
   ```

3. `src/lib/animations.ts`
   All 8 hooks using react-native-reanimated v4 API. Read sdd/specs/design.md ## ANIMATION SYSTEM for exact signatures:
   - useFadeInUp(delay?) — opacity 0→1, translateY 20→0, withTiming
   - useScaleIn(delay?) — scale 0.92→1 + opacity 0→1
   - useSlideInRight() — translateX 40→0 + opacity 0→1
   - useStagger(count, baseDelay) — returns array of animated styles, each delayed by index×baseDelay
   - usePressScale(scale=0.96) — returns { pressHandlers, animatedStyle } using withSpring
   - useCartBounce() — scale 1→1.3→1 triggered imperatively
   - useShimmer() — looping translateX for skeleton shimmer
   - useParallax(scrollY, factor=0.3) — returns translateY derived value

4. `src/schemas/login.schema.ts`
   ```ts
   // z.object({ email: z.string().email('Invalid email'), password: z.string().min(6, 'Min 6 chars') })
   // export type LoginFormData = z.infer<typeof loginSchema>
   ```

5. `src/schemas/checkout.schema.ts`
   ```ts
   // fullName min 2, address min 5, city min 2
   // cardNumber: z.string().regex(/^\d{16}$/, '16 digits')
   // expiry: z.string().regex(/^\d{2}\/\d{2}$/, 'MM/YY')
   // cvv: z.string().regex(/^\d{3}$/, '3 digits')
   // export type CheckoutFormData = z.infer<typeof checkoutSchema>
   ```
