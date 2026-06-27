# Wave 7 / Task — Home top-row layout fix

## Spec source
Read `sdd/specs/redesign-trendora-v2.md` — "app/(tabs)/index.tsx" subsection.
Read the existing file first: `app/(tabs)/index.tsx`.

## File to modify

`app/(tabs)/index.tsx`

## Required changes

### 1. Restructure the top row

Today the top row is:
```
[Avatar + "GBTL" together on left] ........ [cart inside white pill on right]
```

Change to:
```
[Avatar] .... [GBTL — centered] .... [cart icon + badge — no pill background]
```

Replace the current `<View className="px-5 mb-4 flex-row items-center justify-between" ...>` block with:

```tsx
<View
  className="px-5 mb-4 flex-row items-center"
  style={{ marginTop: insets.top + 8 }}
>
  {/* Left — avatar */}
  <Pressable
    className="bg-surface rounded-full overflow-hidden border border-border"
    style={{ width: 36, height: 36 }}
    onPress={() => router.push('/(tabs)/profile')}
  >
    {user?.avatarUrl ? (
      <Image source={{ uri: user.avatarUrl }} style={{ width: 36, height: 36 }} contentFit="cover" />
    ) : (
      <View className="bg-primary w-full h-full items-center justify-center">
        <Typography variant="body-sm" weight="bold" color="white">
          {getInitials(user?.name ?? 'GB')}
        </Typography>
      </View>
    )}
  </Pressable>

  {/* Middle — brand centered */}
  <View className="flex-1 items-center">
    <Typography variant="heading3" weight="bold">GBTL</Typography>
  </View>

  {/* Right — bare cart icon with badge */}
  <Animated.View style={cartPress.animatedStyle}>
    <Pressable
      onPress={() => router.push('/(tabs)/cart')}
      onPressIn={cartPress.handlePressIn}
      onPressOut={cartPress.handlePressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}
    >
      <ShoppingBag size={22} color={Colors.primary} />
      {totalItems > 0 && (
        <View className="absolute -top-1 -right-1">
          <Badge variant="accent" size="sm">{totalItems}</Badge>
        </View>
      )}
    </Pressable>
  </Animated.View>
</View>
```

Notice: the right cart no longer has a `bg-surface border border-border` circular background — it's just the icon plus the floating badge.

### 2. Wrap the ProductGrid to add bottom buffer

Today the grid is in `<View className="flex-1">`. Change to:

```tsx
<View className="flex-1" style={{ paddingBottom: 0 }}>
  <ProductGrid .../>
</View>
```

Actually no extra wrapper needed if ProductGrid's `contentContainerStyle.paddingBottom` is being changed in the parallel task. Keep the existing `<View className="flex-1"><ProductGrid .../></View>`. (No additional change here — the grid task handles padding.)

### 3. Leave the rest of the screen unchanged

Greeting, SearchBar, category pills, and grid stay exactly the same.

## Constraints

- File MUST stay ≤150 lines
- All hard rules from CLAUDE.md (no raw Text, no hex, reanimated only, safe area insets, etc.)

## Acceptance

- `npx tsc --noEmit` clean
- Top row visually matches: avatar left, brand centered, bare cart icon right
- Cart badge still updates with cart count
- Tapping avatar still navigates to profile, tapping cart still navigates to cart
