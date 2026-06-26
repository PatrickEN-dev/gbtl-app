# Wave 5 / Task A — Root Layout + Auth Screens

## Spec source
- `## SCREENS` lines 478–486 (app/_layout.tsx) + 522–527 (login screen)
- `## CROSS-PLATFORM RULES` (lines 529–567)

## Files to generate

1. `app/_layout.tsx` — ROOT LAYOUT
   - **LINE 1 MUST BE**: `import 'react-native-gesture-handler'`
   - Providers (outermost→innermost): ErrorBoundary → GestureHandlerRootView → SafeAreaProvider → QueryClientProvider → BottomSheetModalProvider → Stack
   - On mount: call `useAuth().restoreSession()` to check SecureStore for saved token
   - `SplashScreen.preventAutoHideAsync()` on module load; hide after fonts+session ready
   - `<StatusBar style="auto" />` from expo-status-bar
   - Stack: no default header, screenOptions={{ headerShown: false }}
   - Max 150 lines — keep providers clean, no inline logic

2. `app/+not-found.tsx`
   - ScreenWrapper (not scrollable)
   - EmptyState with AlertCircle icon, title "Page not found", action "Go Home" → `router.replace('/(tabs)/')`

3. `app/(auth)/_layout.tsx`
   - If `useAuth().isAuthenticated`: `<Redirect href="/(tabs)/" />`
   - Else: `<Stack screenOptions={{ headerShown: false }} />`

4. `app/(auth)/login.tsx`
   - ScreenWrapper (not scrollable, KeyboardAvoidingView)
   - `useScaleIn()` on the card container
   - GBTL wordmark: Typography display color=accent "GBTL" + Typography body-sm color=muted "YOUR VISION YOUR STYLE"
   - `<LoginForm />`
   - "Continue as guest" link → `router.replace('/(tabs)/')`
   - Max 150 lines — all form logic is in LoginForm, all auth logic in useAuth
