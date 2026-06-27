// src/components/ui/Button.tsx
import React from 'react'
import { Pressable, ActivityIndicator, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { usePressScale } from '@/lib/animations'
import { Colors } from '@/constants/tokens'
import Typography from './Typography'

// ─── Types ────────────────────────────────────────────────────────────────────

type Variant = 'primary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps {
  variant?: Variant
  size?: Size
  rounded?: 'btn' | 'pill'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  loading?: boolean
  fullWidth?: boolean
  disabled?: boolean
  onPress?: () => void
  children: React.ReactNode
}

// ─── Style maps ──────────────────────────────────────────────────────────────

/** NativeWind classNames for each variant container */
const CONTAINER_VARIANT: Record<Variant, string> = {
  primary: 'bg-accent shadow-btn',
  outline: 'border border-primary bg-transparent',
  ghost:   'bg-transparent',
}

/** Height + horizontal padding per size (radius applied separately via rounded prop) */
const CONTAINER_SIZE: Record<Size, string> = {
  sm: 'h-9 px-3',
  md: 'h-12 px-5',
  lg: 'h-14 px-6',
}

/** Typography color for each variant */
const TEXT_COLOR: Record<Variant, 'white' | 'primary'> = {
  primary: 'white',
  outline: 'primary',
  ghost:   'primary',
}

/** Typography variant for each button size */
const TEXT_VARIANT: Record<Size, 'body-sm' | 'body' | 'heading3'> = {
  sm: 'body-sm',
  md: 'body',
  lg: 'heading3',
}

// ─── Shadow (iOS + Android) ──────────────────────────────────────────────────
// NativeWind's custom boxShadow token doesn't translate to RN shadow props,
// so we provide explicit RN shadow for primary variant per CLAUDE.md rules.

const PRIMARY_SHADOW = {
  shadowColor:   Colors.accent,
  shadowOffset:  { width: 0, height: 4 },
  shadowOpacity: 0.30,
  shadowRadius:  8,
  elevation:     6,
} as const

// ─── Component ───────────────────────────────────────────────────────────────

export default function Button({
  variant = 'primary',
  size = 'md',
  rounded = 'btn',
  leftIcon,
  rightIcon,
  loading = false,
  fullWidth = false,
  disabled = false,
  onPress,
  children,
}: ButtonProps) {
  const { animatedStyle, handlePressIn, handlePressOut } = usePressScale(0.96)

  const isDisabled = disabled || loading

  const radiusClass = rounded === 'pill' ? 'rounded-pill' : 'rounded-btn'

  const containerClass = [
    'flex-row items-center justify-center',
    CONTAINER_VARIANT[variant],
    CONTAINER_SIZE[size],
    radiusClass,
    fullWidth ? 'w-full' : 'self-start',
    isDisabled ? 'opacity-50' : '',
  ]
    .filter(Boolean)
    .join(' ')

  // ActivityIndicator color must be a string value (not a className)
  const spinnerColor = variant === 'primary' ? Colors.surface : Colors.primary

  // Apply iOS/Android shadow via RN style for primary variant
  const shadowStyle = variant === 'primary' ? PRIMARY_SHADOW : undefined

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
    >
      <Animated.View
        className={containerClass}
        style={[animatedStyle, shadowStyle]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={spinnerColor} />
        ) : (
          <>
            {leftIcon != null && (
              <View className="mr-2 items-center justify-center">
                {leftIcon}
              </View>
            )}

            {typeof children === 'string' ? (
              <Typography
                variant={TEXT_VARIANT[size]}
                color={TEXT_COLOR[variant]}
                weight="semibold"
              >
                {children}
              </Typography>
            ) : (
              children
            )}

            {rightIcon != null && (
              <View className="ml-2 items-center justify-center">
                {rightIcon}
              </View>
            )}
          </>
        )}
      </Animated.View>
    </Pressable>
  )
}
