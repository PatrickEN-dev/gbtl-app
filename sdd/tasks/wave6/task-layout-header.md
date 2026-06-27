# Wave 6 / Task — Header refactor (rounded icons variant)

## Spec source
Read `sdd/specs/redesign-trendora.md` — "Header.tsx" subsection.
Read the existing `src/components/layout/Header.tsx` first to preserve all current behavior.

## File to modify (not regenerate from scratch)

`src/components/layout/Header.tsx`

## Required change

Add a new boolean prop `roundedIcons?: boolean` to `HeaderProps`. When true:

- The back button (when `showBack`) renders inside a circle: 40x40 `bg-surface rounded-full items-center justify-center` with a light shadow (iOS: `shadowColor: Colors.primary, shadowOffset:{width:0,height:1}, shadowOpacity:0.06, shadowRadius:4`; Android: `elevation: 2`).
- The right-side container wraps `rightElement` and the cart button (when `showCart`) similarly — wrap each into a 40x40 rounded surface circle as above. Achieve this with a small inner helper `RoundedSlot` that wraps its children in the styled circle.
- The header background stays the existing `bg-surface` (since `transparent` is a different prop). Container padding/shadow rules from the current implementation remain.
- The center title rendering stays the same.

Backwards compatibility: when `roundedIcons` is falsy (default), the rendering is **identical** to today. Do not delete any existing prop.

## Constraints
- Do NOT add new dependencies.
- Keep all existing imports.
- Keep the file under 150 lines if possible (current is ~108).
- Continue to read `useSafeAreaInsets()` for `paddingTop`.
- All shadows must include both iOS (shadowColor etc.) and Android (elevation).

## Acceptance
- `npx tsc --noEmit` clean
- Existing callers (`<Header title="Cart" />`, `<Header title="Profile" />`, etc.) render exactly as before
- `<Header showBack roundedIcons title="Details" rightElement={...} />` renders rounded white circle for back button and wraps the rightElement in a matching circle
