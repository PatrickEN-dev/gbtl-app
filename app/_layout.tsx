import 'react-native-gesture-handler'
// app/_layout.tsx
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClientProvider } from '@tanstack/react-query'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import ErrorBoundary from '@/components/layout/ErrorBoundary'
import { queryClient } from '@/lib/queryClient'
import { useAuth } from '@/hooks/useAuth'

SplashScreen.preventAutoHideAsync()

// Separate component so it lives inside QueryClientProvider
// (useAuth → useQueryClient requires the provider to be mounted first)
function AppInitializer() {
  const { restoreSession } = useAuth()

  useEffect(() => {
    async function prepare() {
      try {
        await restoreSession()
      } finally {
        await SplashScreen.hideAsync()
      }
    }
    prepare()
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
            <BottomSheetModalProvider>
              <Stack screenOptions={{ headerShown: false }} />
              <StatusBar style="auto" />
            </BottomSheetModalProvider>
          </QueryClientProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  )
}
