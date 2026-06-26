# Wave 4 / Task B — ImageCarousel

## Spec source
Read `sdd/specs/design.md` — contains `## DESIGN PATTERNS` (compound component pattern) and `## ANIMATION SYSTEM` (useSlideInRight for carousel slide transition).

## Files to generate

1. `src/components/product/ImageCarousel/index.tsx` — Compound component

   **ImageCarousel.Root**
   - Props: `images: string[]`, `children`
   - Manages `activeIndex` state
   - Uses GestureDetector with Pan gesture for swipe detection
   - Snap to each image on swipe release (withSpring)
   - Provides context: `{ activeIndex, setActiveIndex, images }`

   **ImageCarousel.Slide**
   - Renders the current image using expo-image
   - Full-width, height 400, `contentFit="cover"`
   - `useSlideInRight()` animates in on mount

   **ImageCarousel.Thumbnails**
   - FlatList horizontal of 60×60 thumbnails
   - Active thumbnail: accent border ring
   - Press thumbnail → setActiveIndex

   **ImageCarousel.Dots**
   - Row of dots, one per image
   - Active dot: animated width 20px bg-accent | inactive: 6px bg-border
   - Width animates with `withTiming`

   Export: `export const ImageCarousel = { Root, Slide, Thumbnails, Dots }`
