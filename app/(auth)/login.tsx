// app/(auth)/login.tsx
import { View, Pressable } from 'react-native'
import Animated from 'react-native-reanimated'
import { router } from 'expo-router'
import ScreenWrapper from '@/components/layout/ScreenWrapper'
import Typography from '@/components/ui/Typography'
import LoginForm from '@/components/forms/LoginForm'
import { useScaleIn } from '@/lib/animations'

export default function LoginScreen() {
  const { animatedStyle } = useScaleIn()

  return (
    <ScreenWrapper>
      <Animated.View className="flex-1" style={animatedStyle}>
        {/* GBTL Wordmark */}
        <View className="items-center pt-16 pb-10">
          <Typography variant="display" color="accent">
            GBTL
          </Typography>
          <Typography variant="body-sm" color="muted">
            CURATED FASHION
          </Typography>
        </View>

        {/* Login Form — all form + auth logic encapsulated */}
        <LoginForm />

        {/* Continue browsing link */}
        <View className="items-center pb-10">
          <Pressable onPress={() => router.replace('/(tabs)')}>
            <Typography variant="body-sm" color="accent">
              Continue browsing
            </Typography>
          </Pressable>
        </View>
      </Animated.View>
    </ScreenWrapper>
  )
}
