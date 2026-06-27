import "react-native-gesture-handler";
// app/_layout.tsx
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import { useAuth } from "@/hooks/useAuth";
import "@/lib/i18n";
import { queryClient } from "@/lib/queryClient";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { StripeProvider } from "@stripe/stripe-react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import Constants from "expo-constants";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string>;

SplashScreen.preventAutoHideAsync();

// Separate component so it lives inside QueryClientProvider
// (useAuth → useQueryClient requires the provider to be mounted first)
function AppInitializer() {
  const { restoreSession } = useAuth();

  useEffect(() => {
    async function prepare() {
      try {
        await restoreSession();
        // Push registration is disabled in Expo Go until we switch to a development build.
        // registerForPushNotificationsAsync().catch(() => {})
      } finally {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [restoreSession]);

  return null;
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView className="flex-1">
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <AppInitializer />
            <StripeProvider
              publishableKey={extra.stripePublishableKey ?? ""}
              merchantIdentifier={extra.stripeMerchantId}
            >
              <BottomSheetModalProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="onboarding" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="(auth)" options={{ presentation: "modal" }} />
                  <Stack.Screen name="product/[id]" />
                  <Stack.Screen name="wishlist" />
                  <Stack.Screen name="privacy" />
                  <Stack.Screen name="terms" />
                  <Stack.Screen name="delete-account" />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
              </BottomSheetModalProvider>
            </StripeProvider>
          </QueryClientProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
