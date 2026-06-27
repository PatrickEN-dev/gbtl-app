# Wave 9 / Task — TabBar frosted-glass blur

## Spec source
Read `sdd/specs/redesign-trendora-v3.md` — "TabBar frosted-glass blur" subsection.
Read existing `src/components/layout/TabBar.tsx` first.

## File to modify

`src/components/layout/TabBar.tsx`

## Required change

Wrap the inner pill (the `<View className="bg-surface rounded-pill flex-row">` block) so the pill becomes translucent with a real frosted-glass blur backdrop.

### Steps

1. Add import:
```ts
import { BlurView } from 'expo-blur'
```

2. Restructure the inner pill. Today it's:
```tsx
<View
  className="bg-surface rounded-pill flex-row"
  style={{ height: 64, shadowColor: Colors.primary, ... }}
>
  {tabs}
</View>
```

Change to:
```tsx
<View
  style={{
    height: 64,
    borderRadius: 9999,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    backgroundColor: 'rgba(255,255,255,0.7)', // Android fallback if BlurView dims
  }}
>
  <BlurView intensity={70} tint="light" style={{ position: 'absolute', inset: 0 }} />
  <View className="flex-row flex-1">
    {tabs}
  </View>
</View>
```

Note: `style.inset` shorthand may not exist on RN — use `{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }` instead.

3. Replace `import { Colors }` usage with `const colors = useThemeColors()` (call inside the TabBar component). Update the shadow style + iconColor logic to use `colors.primary` and `colors.muted` instead of imported Colors. Import path:
```ts
import { useThemeColors } from '@/hooks/useThemeColors'
```

4. The active-dot indicator stays exactly the same (already uses `bg-primary` className which auto-themes).

5. Drop the bare `import { Colors } from '@/constants/tokens'` line.

## Constraints
- Reanimated only
- Both iOS (shadowColor etc) and Android (elevation) — Android also needs the rgba fallback bg since BlurView on Android can be inconsistent
- Use `useThemeColors()` for JS-side color values
- File should stay ≤120 lines

## Acceptance
- `npx tsc --noEmit` clean
- TabBar shows a translucent blurred pill at the bottom over content
- Active icon stays primary-color, inactive muted
- Cart badge still renders when totalItems > 0
