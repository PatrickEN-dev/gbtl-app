# Wave 3 / Task C — Skeleton Components

## Spec source
Read `sdd/specs/design.md` — contains `## ANIMATION SYSTEM` with useShimmer hook signature.
Read `sdd/specs/screens.md` — contains `## COMPONENT LOADING STATES` describing how skeletons are used.

## Files to generate

1. `src/components/ui/Skeleton.tsx` — export 4 components from this file:

   **Skeleton** (base)
   - Props: `width: number | string`, `height: number`, `borderRadius?: number`
   - Uses `useShimmer()` from animations.ts — Reanimated Animated.View with animatedStyle
   - Background: `bg-border` via className; shimmer overlays a lighter translucent gradient-effect via opacity animation
   - Default borderRadius: 8

   **SkeletonGroup**
   - Props: `children: React.ReactNode`, `gap?: number`
   - A View with flexDirection column and the given gap between children

   **ProductCardSkeleton**
   - Mimics ProductCard layout: image area 100% width × 200 height, then name line 70%×16, price line 40%×14
   - Uses Skeleton base components, no props needed

   **ProductDetailSkeleton**
   - Image 100% width × 400 height, then name 60%×24, price 30%×20, three text lines (80%, 90%, 70%) × 14
   - Uses Skeleton base components, no props needed
