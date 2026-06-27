# Wave 7 / Task — ColorSwatch hideLabel prop

## Spec source
Read `sdd/specs/redesign-trendora-v2.md` — "ColorSwatch.tsx" subsection.
Read the existing file first: `src/components/product/ColorSwatch.tsx`.

## File to modify

`src/components/product/ColorSwatch.tsx`

## Required change

Add an optional prop:

```ts
interface ColorSwatchProps {
  colors: ProductColor[]
  selected: ProductColor
  onSelect: (color: ProductColor) => void
  hideLabel?: boolean  // default false
}
```

When `hideLabel` is true, do NOT render the `<Typography variant="caption" color="muted" className="mt-2">{selected.name}</Typography>` line at the bottom. The swatch row alone is rendered.

When `hideLabel` is false or undefined, behavior is identical to today.

## Constraints

- Default export stays `ColorSwatch`
- Preserve all existing behavior (press animation, ring around selected, etc.)
- No new dependencies
- No new files

## Acceptance

- `npx tsc --noEmit` clean
- `<ColorSwatch colors={...} selected={...} onSelect={...} />` renders identically to today
- `<ColorSwatch colors={...} selected={...} onSelect={...} hideLabel />` renders ONLY the swatch row, no label below
