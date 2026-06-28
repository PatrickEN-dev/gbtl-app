import React from 'react'
import { Pressable } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useColorScheme } from 'nativewind'
import { Moon, Sun } from 'lucide-react-native'
import { useThemeColors } from '@/hooks/useThemeColors'
import { Duration, Spring } from '@/lib/animations'

interface ThemeToggleProps {
  size?: number
}

export default function ThemeToggle({ size = 18 }: ThemeToggleProps) {
  const { colorScheme, setColorScheme } = useColorScheme()
  const colors = useThemeColors()
  const isDark = colorScheme === 'dark'

  const rotation = useSharedValue(isDark ? 1 : 0)
  const scale = useSharedValue(1)

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value * 180}deg` }],
  }))

  const handlePress = () => {
    rotation.value = withTiming(isDark ? 0 : 1, { duration: Duration.slow })
    scale.value = withSequence(
      withSpring(0.85, Spring.snappy),
      withSpring(1, Spring.gentle),
    )
    setColorScheme(isDark ? 'light' : 'dark')
  }

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-9 h-9 items-center justify-center rounded-full"
      style={{ backgroundColor: 'transparent' }}
    >
      <Animated.View style={iconStyle}>
        {isDark ? (
          <Sun size={size} color={colors.muted} strokeWidth={2} />
        ) : (
          <Moon size={size} color={colors.muted} strokeWidth={2} />
        )}
      </Animated.View>
    </Pressable>
  )
}
