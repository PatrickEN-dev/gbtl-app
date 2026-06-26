# Wave 5 / Task A — Root Layout + Auth Screens

## Spec source
Read `sdd/specs/screens.md` — contains full `## SCREENS` section (all screen specs) and `## CROSS-PLATFORM RULES`.

## Files to DELETE first (Expo default artifacts — they conflict with GBTL routing)
Before generating any file, DELETE these if they exist:
- `app/(tabs)/explore.tsx` — Expo default, conflicts with GBTL tabs (uses Bash: `rm -f app/(tabs)/explore.tsx`)
- `app/modal.tsx` — Expo default, not part of GBTL (uses Bash: `rm -f app/modal.tsx`)

## Files to generate

1. `app/index.tsx` — ENTRY POINT REDIRECT
   ```tsx
   // Simple redirect — tabs is always the initial screen, login is never forced
   import { Redirect } from 'expo-router'
   export default function Index() {
     return <Redirect href="/(tabs)/" />
   }
   ```

2. `app/_layout.tsx` — ROOT LAYOUT
   - **LINE 1 MUST BE**: `import 'react-native-gesture-handler'`
   - Providers (outermost→innermost): ErrorBoundary → GestureHandlerRootView → SafeAreaProvider → QueryClientProvider → BottomSheetModalProvider → Stack
   - On mount: call `useAuth().restoreSession()` only — do NOT redirect anywhere based on auth state here
   - `SplashScreen.preventAutoHideAsync()` on module load; hide after session check completes
   - `<StatusBar style="auto" />` from expo-status-bar
   - Stack: no default header, screenOptions={{ headerShown: false }}
   - Max 150 lines — keep providers clean, no inline logic

3. `app/+not-found.tsx`
   - ScreenWrapper (not scrollable)
   - EmptyState with AlertCircle icon, title "Page not found", action "Go Home" → `router.replace('/(tabs)/')`

4. `app/(auth)/_layout.tsx`
   - If `useAuth().isAuthenticated`: `<Redirect href="/(tabs)/" />` (already logged in — no need to see login)
   - Else: `<Stack screenOptions={{ headerShown: false }} />`

5. `app/(auth)/login.tsx`
   - ScreenWrapper (not scrollable, KeyboardAvoidingView)
   - `useScaleIn()` on the card container
   - GBTL wordmark: Typography display color=accent "GBTL" + Typography body-sm color=muted "CURATED FASHION"
   - `<LoginForm />`
   - "Continue browsing" link below form → `router.back()` (returns to wherever the user came from)
   - Max 150 lines — all form logic is in LoginForm, all auth logic in useAuth
