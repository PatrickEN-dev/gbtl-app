# Wave 1 — Export Contract
# Linker reads this file to verify wave 1 outputs match these signatures

## Config files (no imports to check — just existence)
- [ ] `package.json` exists
- [ ] `babel.config.js` exists
- [ ] `tailwind.config.js` exists
- [ ] `metro.config.js` exists
- [ ] `global.css` exists
- [ ] `app.json` exists
- [ ] `tsconfig.json` exists

## src/types/index.ts
Named exports required:
- `Product` (interface)
- `ProductColor` (interface)
- `ProductSize` (interface)
- `CartItem` (interface)
- `AuthUser` (interface)
- `RootStackParamList` (type)

## src/constants/tokens.ts
Named exports required:
- `Colors` (const object with: bg, surface, accent, primary, muted, border, overlay)
- `Radius` (const object with: card, btn, pill, input)
- `Spacing` (const object with: xs, sm, md, lg, xl, xxl)

## src/data/mockProducts.ts
Named exports required:
- `mockProducts` (Product[] — 12 items, IDs p001–p012)

## src/services/products.ts
Named exports required:
- `fetchProducts` (function — signature: (category?: string) => Promise<Product[]>)
- `fetchProduct` (function — signature: (id: string) => Promise<Product>)

## src/services/auth.ts
Named exports required:
- `login` (function — signature: (email: string, password: string) => Promise<{ user: AuthUser; token: string }>)

## src/lib/queryClient.ts
Named exports required:
- `queryClient` (QueryClient instance)

## src/lib/secureStore.ts
Named exports required:
- `getToken` (function — () => Promise<string | null>)
- `setToken` (function — (v: string) => Promise<void>)
- `deleteToken` (function — () => Promise<void>)

## src/lib/animations.ts
Named exports required:
- `Duration` (const: { fast, base, slow, lazy })
- `Easing` (const: { standard, decelerate, accelerate })
- `Spring` (const: { gentle, snappy })
- `useFadeInUp` (function hook)
- `useScaleIn` (function hook)
- `useSlideInRight` (function hook)
- `useStagger` (function hook)
- `usePressScale` (function hook)
- `useCartBounce` (function hook)
- `useShimmer` (function hook)
- `useParallax` (function hook)

## src/schemas/login.schema.ts
Named exports required:
- `loginSchema` (z.ZodObject)
- `LoginFormData` (type)

## src/schemas/checkout.schema.ts
Named exports required:
- `checkoutSchema` (z.ZodObject)
- `CheckoutFormData` (type)
