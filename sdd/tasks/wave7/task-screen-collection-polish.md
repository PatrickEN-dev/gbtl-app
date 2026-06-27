# Wave 7 / Task — Collection sort pill color

## Spec source
Read `sdd/specs/redesign-trendora-v2.md` — "Collection" subsection.
Read the existing file first: `app/(tabs)/collection.tsx`.

## File to modify

`app/(tabs)/collection.tsx`

## Required change

Change the active sort pill from accent-colored to primary-colored so it matches the new design system. Find this className:

```tsx
className={`px-4 py-2 rounded-full border ${
  sort === item
    ? 'bg-accent border-accent'
    : 'bg-surface border-border'
}`}
```

Change to:

```tsx
className={`px-4 py-2 rounded-full border ${
  sort === item
    ? 'bg-primary border-primary'
    : 'bg-surface border-border'
}`}
```

That's the only change.

## Constraints

- File MUST stay ≤150 lines (currently ~75)
- No other behavior changes

## Acceptance

- `npx tsc --noEmit` clean
- Active sort pill renders with dark primary background instead of orange accent
