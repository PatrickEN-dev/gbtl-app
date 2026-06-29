import React from 'react'
import { View } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import Typography from '@/components/ui/Typography'
import Button from '@/components/ui/Button'
import { useOnboarding } from '@/hooks/useOnboarding'
import { useTranslation } from '@/lib/i18n'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80'

export default function OnboardingScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { complete } = useOnboarding()
  const { t } = useTranslation()

  async function handleStart() {
    await complete()
    router.replace('/(tabs)')
  }

  return (
    <View
      className="flex-1 bg-bg"
      style={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }}
    >
      <Animated.View entering={FadeIn.duration(720)} className="px-8">
        <Typography
          variant="display"
          italic
          className="text-center"
          style={{ letterSpacing: 0.5 }}
        >
          GBTL
        </Typography>
        <View className="h-px bg-border mt-3" />
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(820).delay(120)}
        className="flex-1 mt-8 px-6"
      >
        <View
          className="flex-1 overflow-hidden rounded-card bg-surface"
          style={{ borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)' }}
        >
          <Image
            source={{ uri: HERO_IMAGE }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={400}
          />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(720).delay(280)} className="px-6 mt-8">
        <Button variant="primary" fullWidth rounded="btn" size="lg" onPress={handleStart}>
          {t('onboarding.getStarted')}
        </Button>
      </Animated.View>
    </View>
  )
}
