# Wave 7 / Task — Button rounded='pill' option

## Spec source
Read `sdd/specs/redesign-trendora-v2.md` — "Button.tsx" subsection.
Read the existing file first: `src/components/ui/Button.tsx`.

## File to modify

`src/components/ui/Button.tsx`

## Required change

Add an optional `rounded?: 'btn' | 'pill'` prop (default `'btn'`). Today the `CONTAINER_SIZE` map bakes `rounded-btn` into each size entry. Split the radius out so it can switch:

1. Strip `rounded-btn` out of `CONTAINER_SIZE`:
   ```ts
   const CONTAINER_SIZE: Record<Size, string> = {
     sm: 'h-9 px-3',
     md: 'h-12 px-5',
     lg: 'h-14 px-6',
   }
   ```
2. Add to `ButtonProps`:
   ```ts
   rounded?: 'btn' | 'pill'
   ```
3. In the container className assembly:
   ```ts
   const radiusClass = rounded === 'pill' ? 'rounded-pill' : 'rounded-btn'
   const containerClass = [
     'flex-row items-center justify-center',
     CONTAINER_VARIANT[variant],
     CONTAINER_SIZE[size],
     radiusClass,
     fullWidth ? 'w-full' : 'self-start',
     isDisabled ? 'opacity-50' : '',
   ].filter(Boolean).join(' ')
   ```

Default value for `rounded` is `'btn'` so existing callers render identically.

## Constraints

- Don't change any other behavior (press scale, shadow, loading state, etc.)
- Existing exported `ButtonProps` type augmented additively (new field is optional)
- File should remain under 160 lines

## Acceptance

- `npx tsc --noEmit` clean
- `<Button variant="primary">Hi</Button>` renders with `rounded-btn` exactly like today
- `<Button variant="primary" rounded="pill">Hi</Button>` renders with `rounded-pill`
