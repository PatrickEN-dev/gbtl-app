// src/components/primitives/IconButton.tsx
import React from 'react'
import { Pressable, View } from 'react-native'
import Animated from 'react-native-reanimated'
import Badge from '@/components/ui/Badge'
import { usePressScale } from '@/lib/animations'
import { useThemeColors } from '@/hooks/useThemeColors'

// ─── Types ────────────────────────────────────────────────────────────────────

type IconButtonVariant = 'ghost' | 'surface' | 'filled'
type IconButtonSize = 'sm' | 'md' | 'lg'

interface IconButtonProps {
  icon: React.ReactNode
  variant?: IconButtonVariant
  size?: IconButtonSize
  badge?: number
  onPress?: () => void
  accessibilityLabel?: string
  hitSlop?: { top: number; bottom: number; left: number; right: number }
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const sizeContainerMap: Record<IconButtonSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

const variantContainerMap: Record<IconButtonVariant, string> = {
  ghost:   'bg-transparent',
  surface: 'bg-surface rounded-full',
  filled:  'bg-primary rounded-full',
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  badge,
  onPress,
  accessibilityLabel,
  hitSlop = { top: 8, bottom: 8, left: 8, right: 8 },
}: IconButtonProps) {
  const { animatedStyle, handlePressIn, handlePressOut } = usePressScale(0.9)
  const colors = useThemeColors()

  const surfaceShadow =
    variant === 'surface'
      ? {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 2,
        }
      : undefined

  const containerClass = `${sizeContainerMap[size]} ${variantContainerMap[variant]} items-center justify-center`

  return (
    <Animated.View style={animatedStyle} className="relative">
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        hitSlop={hitSlop}
      >
        <View className={containerClass} style={surfaceShadow}>
          {icon}
        </View>
      </Pressable>
      {badge !== undefined && badge > 0 && (
        <View className="absolute -top-1 -right-1">
          <Badge variant="accent" size="sm">{badge}</Badge>
        </View>
      )}
    </Animated.View>
  )
}
