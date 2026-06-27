// app/(auth)/login.tsx
import React, { useState } from 'react'
import { View, Pressable, Alert } from 'react-native'
import Animated from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import { Plus } from 'lucide-react-native'
import { Svg, Path } from 'react-native-svg'
import ScreenWrapper from '@/components/layout/ScreenWrapper'
import Typography from '@/components/ui/Typography'
import Button from '@/components/ui/Button'
import { useScaleIn } from '@/lib/animations'
import { useThemeColors } from '@/hooks/useThemeColors'
import { useGoogleSignIn } from '@/services/googleAuth'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/lib/i18n'

function GoogleLogo({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18">
      <Path fill="#EA4335" d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z" />
      <Path fill="#4285F4" d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z" />
      <Path fill="#FBBC05" d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A8.998 8.998 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z" />
      <Path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z" />
    </Svg>
  )
}

export default function LoginScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const { animatedStyle } = useScaleIn()
  const colors = useThemeColors()
  const { signIn, isReady } = useGoogleSignIn()
  const { completeGoogleLogin } = useAuth()
  const [busy, setBusy] = useState(false)

  async function handleGoogle() {
    setBusy(true)
    try {
      const profile = await signIn()
      if (!profile) return
      await completeGoogleLogin(profile)
      router.replace('/(tabs)/cart')
    } catch (e) {
      Alert.alert('Sign-in failed', (e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <ScreenWrapper>
      <Animated.View className="flex-1 justify-between px-6 pb-6" style={animatedStyle}>
        <View />

        <View className="items-center gap-3">
          <Plus size={56} color={colors.primary} strokeWidth={2.5} />
          <Typography variant="heading1">{t('auth.welcome')}</Typography>
          <Typography variant="body" color="muted" className="text-center px-6">
            {t('auth.subtitle')}
          </Typography>
        </View>

        <View className="gap-4">
          <Button
            variant="outline"
            fullWidth
            rounded="pill"
            loading={busy}
            disabled={!isReady}
            leftIcon={<GoogleLogo size={18} />}
            onPress={handleGoogle}
          >
            {t('auth.continueWithGoogle')}
          </Button>

          <Pressable onPress={() => router.replace('/(tabs)')} className="self-center">
            <Typography variant="body-sm" color="muted">{t('auth.skip')}</Typography>
          </Pressable>

          <View className="items-center mt-2 gap-1">
            <Typography variant="caption" color="muted" className="text-center">
              By continuing you agree to our
            </Typography>
            <View className="flex-row gap-2">
              <Pressable onPress={() => router.push('/terms')} hitSlop={6}>
                <Typography variant="caption" color="accent">{t('auth.termsLink')}</Typography>
              </Pressable>
              <Typography variant="caption" color="muted">·</Typography>
              <Pressable onPress={() => router.push('/privacy')} hitSlop={6}>
                <Typography variant="caption" color="accent">{t('auth.privacyLink')}</Typography>
              </Pressable>
            </View>
          </View>
        </View>
      </Animated.View>
    </ScreenWrapper>
  )
}
