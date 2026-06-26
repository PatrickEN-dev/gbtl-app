# Wave 4 / Task B — ImageCarousel

## Spec source
- `## DESIGN PATTERNS` (lines 253–280) — Compound component pattern
- `## ANIMATION SYSTEM` (lines 332–371) — useSlideInRight

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
