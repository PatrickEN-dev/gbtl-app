# Wave 6 / Task — ImageCarousel.SideThumbnails + flexible Slide

## Spec source
Read `sdd/specs/redesign-trendora.md` — "ImageCarousel" subsection.
Read the existing `src/components/product/ImageCarousel/index.tsx` first.

## File to modify

`src/components/product/ImageCarousel/index.tsx`

## Required changes

### 1. Make `Slide` flexible

The current Slide renders `<Image style={{ width: '100%', height: 400 }} />`. Change Slide to accept an optional prop:

```ts
type SlideProps = { aspectRatio?: number } // default 1
```

Replace the inline style with `{ width: '100%', aspectRatio: aspectRatio ?? 1 }`. Existing callers (`<ImageCarousel.Slide />`) will get a square — for the product detail page that's the new desired behavior; the previous fixed 400px is being replaced intentionally.

### 2. Add `SideThumbnails`

New sub-component rendering a vertical column of thumbnails (mirroring the existing horizontal `Thumbnails`):

```tsx
function SideThumbnails() {
  const { images, activeIndex, setActiveIndex } = useCarouselContext()
  return (
    <View className="gap-2 pl-2 justify-center">
      {images.slice(0, 4).map((uri, index) => (
        <Pressable key={index} onPress={() => setActiveIndex(index)}>
          <View
            className={`w-14 h-14 rounded-lg overflow-hidden ${
              index === activeIndex ? 'border-2 border-accent' : 'border border-border'
            }`}
          >
            <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          </View>
        </Pressable>
      ))}
    </View>
  )
}
```

### 3. Update the export namespace

```ts
export const ImageCarousel = { Root, Slide, Thumbnails, SideThumbnails, Dots }
```

## Constraints
- No new dependencies
- Keep the gesture/context architecture intact
- The change must not break callers that import `ImageCarousel` already
- File can grow slightly (≤200 lines)

## Acceptance
- `npx tsc --noEmit` clean
- `<ImageCarousel.Slide aspectRatio={3/4} />` works
- `<ImageCarousel.SideThumbnails />` renders up to 4 stacked thumbnails and switches active on press
