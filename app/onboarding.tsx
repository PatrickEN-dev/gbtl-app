import React, { useRef, useState } from 'react'
import { View, Dimensions, FlatList, Pressable } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Typography from '@/components/ui/Typography'
import Button from '@/components/ui/Button'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { useOnboarding } from '@/hooks/useOnboarding'
import { useTranslation } from '@/lib/i18n'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

interface Slide {
  title: string
  body: string
}

export default function OnboardingScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { complete } = useOnboarding()
  const { t } = useTranslation()
  const slides = t('onboarding.slides', { returnObjects: true }) as Slide[]
  const [index, setIndex] = useState(0)
  const listRef = useRef<FlatList<Slide>>(null)

  const isLast = index === slides.length - 1

  async function handleFinish() {
    await complete()
    router.replace('/(tabs)')
  }

  function handleNext() {
    if (isLast) {
      handleFinish()
      return
    }
    const next = index + 1
    listRef.current?.scrollToOffset({ offset: next * SCREEN_WIDTH, animated: true })
    setIndex(next)
  }

  return (
    <View
      className="flex-1 bg-bg"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-row items-center justify-between px-5 pt-2">
        <ThemeToggle />
        <Pressable
          onPress={handleFinish}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Typography variant="body-sm" color="muted">
            {t('onboarding.skip')}
          </Typography>
        </Pressable>
      </View>

      <Animated.View entering={FadeIn.duration(720)} className="items-center mt-10">
        <Typography variant="display" weight="bold" style={{ letterSpacing: 6 }}>
          GBTL
        </Typography>
      </Animated.View>

      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH)
          setIndex(i)
        }}
        renderItem={({ item }) => (
          <View
            style={{ width: SCREEN_WIDTH }}
            className="px-8 items-center justify-center"
          >
            <Typography variant="heading1" className="text-center mb-3">
              {item.title}
            </Typography>
            <Typography variant="body" color="muted" className="text-center">
              {item.body}
            </Typography>
          </View>
        )}
        className="flex-1"
      />

      <View className="flex-row items-center justify-center gap-2 mb-6">
        {slides.map((_, i) => (
          <View
            key={i}
            className={`h-1.5 rounded-full ${i === index ? 'bg-primary' : 'bg-muted'}`}
            style={{ width: i === index ? 24 : 6, opacity: i === index ? 1 : 0.4 }}
          />
        ))}
      </View>

      <View className="px-6 pb-4">
        <Button variant="primary" fullWidth rounded="pill" size="lg" onPress={handleNext}>
          {isLast ? t('onboarding.getStarted') : t('onboarding.next')}
        </Button>
      </View>
    </View>
  )
}
