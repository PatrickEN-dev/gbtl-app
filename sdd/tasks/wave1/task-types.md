# Wave 1 / Task B — Types + Data Layer

## Spec source
Read `sdd/specs/data.md` — contains:
- `## TYPES` — exact interface definitions for Product, CartItem, AuthUser, etc.
- `## MOCK DATA` — product data shape, image URL pattern, isSale/isNew/isFeatured distribution
- `## MOCK DATA → src/services/` — fetchProducts and fetchProduct exact implementations

## Files to generate

1. `src/types/index.ts` — Export: Product, ProductColor, ProductSize, CartItem, AuthUser, RootStackParamList interfaces (exact shape from sdd/specs/data.md ## TYPES section)
2. `src/constants/tokens.ts` — TS const objects mirroring CLAUDE.md: Colors, Duration, Spacing, Radius (these are for JS logic, not styling — styling uses className)
3. `src/data/mockProducts.ts` — 12 products (4 per category: men/women/kids). Images: picsum.photos/seed/{id}/400/500. Each: 3 colors, 5 sizes (1 unavailable), price $80–$280, rating 3.5–5.0. 3 isSale with originalPrice. 3 isNew.
4. `src/services/products.ts` — fetchProducts(category?): Promise<Product[]> with 300ms delay. fetchProduct(id): Promise<Product> throws NotFoundError if missing.
5. `src/services/auth.ts` — login(email,password): Promise<{user:AuthUser, token:string}> 500ms any creds. logout(): void. The token is returned here but NEVER stored in Zustand — caller stores it in SecureStore.
