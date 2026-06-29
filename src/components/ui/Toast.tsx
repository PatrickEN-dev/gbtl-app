import React, { useEffect } from 'react'
import { Pressable, View } from 'react-native'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react-native'
import { useColorScheme } from 'nativewind'
import Typography from './Typography'
import { useToastStore, type ToastType } from '@/store/toastStore'
import { Duration } from '@/lib/animations'

const TYPE_COLOR: Record<ToastType, string> = {
  success: 'rgb(92, 124, 95)',
  error: 'rgb(176, 60, 60)',
  warning: 'rgb(180, 130, 60)',
  info: 'rgb(110, 110, 110)',
}

const TYPE_ICON: Record<
  ToastType,
  React.ComponentType<{ size: number; color: string; strokeWidth?: number }>
> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

export default function ToastHost() {
  const current = useToastStore((s) => s.current)
  const dismiss = useToastStore((s) => s.dismiss)
  const insets = useSafeAreaInsets()
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'

  const translateY = useSharedValue(-120)
  const opacity = useSharedValue(0)

  useEffect(() => {
    if (!current) {
      translateY.value = withTiming(-120, { duration: Duration.fast })
      opacity.value = withTiming(0, { duration: Duration.fast })
      return
    }
    translateY.value = withTiming(0, { duration: Duration.base })
    opacity.value = withTiming(1, { duration: Duration.base })

    const ms = current.durationMs ?? 3500
    const timeout = setTimeout(() => {
      translateY.value = withTiming(-120, { duration: Duration.base })
      opacity.value = withTiming(0, { duration: Duration.base }, (finished) => {
        if (finished) runOnJS(dismiss)()
      })
    }, ms)

    return () => clearTimeout(timeout)
  }, [current?.id])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }))

  if (!current) return null

  const Icon = TYPE_ICON[current.type]
  const accentColor = TYPE_COLOR[current.type]
  const surfaceBg = isDark ? 'rgb(37, 42, 38)' : 'rgb(255, 255, 255)'

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: insets.top + 10,
        left: 16,
        right: 16,
        zIndex: 9999,
      }}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderRadius: 14,
            borderLeftWidth: 4,
            borderLeftColor: accentColor,
            backgroundColor: surfaceBg,
            shadowColor: 'rgb(0,0,0)',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: isDark ? 0.4 : 0.12,
            shadowRadius: 16,
            elevation: 8,
          },
        ]}
      >
        <Icon size={22} color={accentColor} strokeWidth={2} />
        <View style={{ flex: 1 }}>
          <Typography variant="body" weight="semibold" font="sans" numberOfLines={2}>
            {current.title}
          </Typography>
          {current.message ? (
            <Typography
              variant="body-sm"
              color="muted"
              className="mt-0.5"
              numberOfLines={3}
            >
              {current.message}
            </Typography>
          ) : null}
        </View>
        <Pressable onPress={dismiss} hitSlop={8} accessibilityLabel="Dismiss">
          <X size={18} color={isDark ? 'rgb(156, 159, 149)' : 'rgb(142, 148, 139)'} />
        </Pressable>
      </Animated.View>
    </View>
  )
}
