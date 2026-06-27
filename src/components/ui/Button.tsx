
import React from 'react'
import { Pressable, ActivityIndicator, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { usePressScale } from '@/lib/animations'
import { useThemeColors } from '@/hooks/useThemeColors'
import Typography from './Typography'


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


const CONTAINER_VARIANT: Record<Variant, string> = {
  primary: 'bg-accent shadow-btn',
  outline: 'border border-primary bg-transparent',
  ghost:   'bg-transparent',
}


const CONTAINER_SIZE: Record<Size, string> = {
  sm: 'h-9 px-3',
  md: 'h-12 px-5',
  lg: 'h-14 px-6',
}


const TEXT_COLOR: Record<Variant, 'white' | 'primary'> = {
  primary: 'white',
  outline: 'primary',
  ghost:   'primary',
}


const TEXT_VARIANT: Record<Size, 'body-sm' | 'body' | 'heading3'> = {
  sm: 'body-sm',
  md: 'body',
  lg: 'heading3',
}


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

  const colors = useThemeColors()

  const spinnerColor = variant === 'primary' ? colors.surface : colors.primary


  const shadowStyle = variant === 'primary'
    ? {
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 8,
        elevation: 6,
      }
    : undefined

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
