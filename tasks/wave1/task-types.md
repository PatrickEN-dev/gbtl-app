# Wave 1 / Task B — Types + Data Layer

## Spec source
Read these GBTL_Prompt_v4.md sections:
- `## TYPES` (lines 372–424) — exact interface definitions
- `## MOCK DATA` (lines 569–580) — product data shape and image URL pattern
- `## DESIGN PATTERNS` (lines 253–306) — understand data flow before writing services

## Files to generate

1. `src/types/index.ts` — Export: Product, ProductColor, ProductSize, CartItem, AuthUser, RootStackParamList interfaces (exact shape from GBTL_Prompt_v4.md ## TYPES section)
2. `src/constants/tokens.ts` — TS const objects mirroring CLAUDE.md: Colors, Duration, Spacing, Radius (these are for JS logic, not styling — styling uses className)
3. `src/data/mockProducts.ts` — 12 products (4 per category: men/women/kids). Images: picsum.photos/seed/{id}/400/500. Each: 3 colors, 5 sizes (1 unavailable), price $80–$280, rating 3.5–5.0. 3 isSale with originalPrice. 3 isNew.
4. `src/services/products.ts` — fetchProducts(category?): Promise<Product[]> with 300ms delay. fetchProduct(id): Promise<Product> throws NotFoundError if missing.
5. `src/services/auth.ts` — login(email,password): Promise<{user:AuthUser, token:string}> 500ms any creds. logout(): void. The token is returned here but NEVER stored in Zustand — caller stores it in SecureStore.
