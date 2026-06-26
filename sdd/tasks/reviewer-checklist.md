# GBTL Reviewer Checklist
# Reviewer agent: run these checks on the files generated in the current wave.
# Report PASS or FAIL with file:line for each item. Do NOT re-read CLAUDE.md.

## Hard FAIL — any of these = wave must be rebuilt

### Text rendering
- No `<Text ` or `<Text>` except inside Typography.tsx itself
  grep: `grep -rn "<Text[ >]" src/ app/ --include="*.tsx" | grep -v "Typography.tsx"`

### Token security
- No `token` field in src/store/authStore.ts state interface
  grep: `grep -n "token" src/store/authStore.ts`
- No `AsyncStorage` anywhere
  grep: `grep -rn "AsyncStorage" src/ app/`

### Animation API
- No `import.*Animated.*from 'react-native'` (must use reanimated)
  grep: `grep -rn "from 'react-native'" src/ app/ | grep "Animated"`

### TanStack Query v5
- No `isLoading` used as "no data yet" check (use `isPending`)
  grep: `grep -rn "isLoading" src/hooks/ src/components/ app/`
- No array+fn syntax: `useQuery\(\[` (v4 pattern, broken in v5)
  grep: `grep -rn "useQuery(\[" src/ app/`

### Zustand v5
- cartStore, wishlistStore, authStore must use double `()()` pattern
  grep: `grep -n "create<" src/store/*.ts | grep -v ")(("` → must return empty

### Colors
- No hardcoded hex strings outside ColorSwatch.tsx
  grep: `grep -rn "#[0-9A-Fa-f]\{3,6\}" src/ app/ --include="*.tsx" | grep -v "ColorSwatch.tsx"`
  EXCEPTION: global.css, tailwind.config.js, app.json, tokens.ts are allowed

### Babel plugin order (wave 1 only)
- In babel.config.js: `reanimated/plugin` must be the LAST item in plugins array

### Root layout (wave 5 only)
- app/_layout.tsx line 1: exactly `import 'react-native-gesture-handler'`
  grep: `head -1 app/_layout.tsx`

### Safe area
- No hardcoded `paddingTop:` or `marginTop:` for device edges — must use `useSafeAreaInsets()`
  grep: `grep -rn "paddingTop:\s*[0-9]" src/components/layout/ app/`

## Soft WARN — flag but do not block

### Line count (screens ≤150 lines)
  `wc -l app/(tabs)/*.tsx app/(auth)/*.tsx app/product/*.tsx`

### Shadows: every iOS shadow must have Android elevation nearby
  grep: `grep -rn "shadowColor" src/ app/` — reviewer manually checks each for `elevation`

### KeyboardAvoidingView behavior
  grep: `grep -rn "KeyboardAvoidingView" src/ app/` — must have `Platform.OS === 'ios' ? 'padding' : 'height'`

## Wave-specific scope
Reviewer only audits files changed in the CURRENT wave.
Do NOT re-audit previous waves unless the tester reports a cross-file issue.
