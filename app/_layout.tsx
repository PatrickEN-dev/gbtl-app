import { GestureHandlerRootView } from 'react-native-gesture-handler'

import CartBottomSheet from '@/components/cart/CartBottomSheet'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import ToastHost from '@/components/ui/Toast'
import ErrorBoundary from '@/components/layout/ErrorBoundary'
import { useAuth } from '@/hooks/useAuth'
import { initAnalytics, track } from '@/lib/analytics'
import { env } from '@/lib/env'
import '@/lib/i18n'
import { initMonitoring } from '@/lib/monitoring'
import { queryClient } from '@/lib/queryClient'
import { registerForPushNotificationsAsync } from '@/services/notifications'
import { useThemeStore } from '@/store/themeStore'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { StripeProvider } from '@stripe/stripe-react-native'
import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'nativewind'
import { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import '../global.css'

SplashScreen.preventAutoHideAsync()

function AppInitializer() {
  const { restoreSession } = useAuth()
  const themePreference = useThemeStore((s) => s.preference)
  const { setColorScheme } = useColorScheme()

  useEffect(() => {
    setColorScheme(themePreference)
  }, [themePreference, setColorScheme])

  useEffect(() => {
    let mounted = true
    async function prepare() {
      try {
        await initMonitoring()
        await initAnalytics()
        await restoreSession()
        track('app_opened')
        registerForPushNotificationsAsync().catch(() => {})
      } finally {
        if (mounted) await SplashScreen.hideAsync()
      }
    }
    prepare()
    return () => {
      mounted = false
    }
  }, [restoreSession])

  return null
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView className="flex-1">
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <AppInitializer />
            <StripeProvider
              publishableKey={env.stripePublishableKey}
              merchantIdentifier={env.stripeMerchantId}
            >
              <BottomSheetModalProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="onboarding" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="(auth)" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="product/[id]" />
                  <Stack.Screen name="wishlist" />
                  <Stack.Screen name="orders/index" />
                  <Stack.Screen name="orders/[id]" />
                  <Stack.Screen name="addresses/index" />
                  <Stack.Screen name="addresses/new" />
                  <Stack.Screen name="settings" />
                  <Stack.Screen name="privacy" />
                  <Stack.Screen name="terms" />
                  <Stack.Screen name="delete-account" />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <CartBottomSheet />
                <ConfirmDialog />
                <ToastHost />
                <StatusBar style="auto" />
              </BottomSheetModalProvider>
            </StripeProvider>
          </QueryClientProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  )
}
