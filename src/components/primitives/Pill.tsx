// src/components/primitives/Pill.tsx
import React from 'react'
import { Pressable, View } from 'react-native'
import Animated from 'react-native-reanimated'
import Typography from '@/components/ui/Typography'
import { usePressScale } from '@/lib/animations'

// ─── Types ────────────────────────────────────────────────────────────────────

type PillVariant = 'solid' | 'ghost' | 'outline'
type PillTone = 'primary' | 'accent' | 'neutral'
type PillSize = 'sm' | 'md' | 'lg'

interface PillProps {
  variant?: PillVariant
  tone?: PillTone
  size?: PillSize
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onPress?: () => void
  children: React.ReactNode
  className?: string
  accessibilityLabel?: string
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const solidBgMap: Record<PillTone, string> = {
  primary: 'bg-primary',
  accent:  'bg-accent',
  neutral: 'bg-border',
}

const ghostBgMap: Record<PillTone, string> = {
  primary: 'bg-transparent',
  accent:  'bg-transparent',
  neutral: 'bg-transparent',
}

const outlineBgMap: Record<PillTone, string> = {
  primary: 'bg-transparent border border-primary',
  accent:  'bg-transparent border border-accent',
  neutral: 'bg-transparent border border-border',
}

const solidTextMap: Record<PillTone, 'white' | 'primary' | 'muted'> = {
  primary: 'white',
  accent:  'white',
  neutral: 'primary',
}

const ghostTextMap: Record<PillTone, 'primary' | 'accent' | 'muted'> = {
  primary: 'primary',
  accent:  'accent',
  neutral: 'muted',
}

const sizeClass: Record<PillSize, string> = {
  sm: 'px-3 py-1',
  md: 'px-4 py-2',
  lg: 'px-5 py-2.5',
}

const textVariantMap: Record<PillSize, 'caption' | 'body-sm' | 'body'> = {
  sm: 'caption',
  md: 'body-sm',
  lg: 'body',
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Pill({
  variant = 'solid',
  tone = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  onPress,
  children,
  accessibilityLabel,
}: PillProps) {
  const { animatedStyle, handlePressIn, handlePressOut } = usePressScale(0.95)

  let bgClass = solidBgMap[tone]
  let textColor: 'white' | 'primary' | 'accent' | 'muted' = solidTextMap[tone]

  if (variant === 'ghost') {
    bgClass = ghostBgMap[tone]
    textColor = ghostTextMap[tone]
  } else if (variant === 'outline') {
    bgClass = outlineBgMap[tone]
    textColor = ghostTextMap[tone]
  }

  const containerClass = `rounded-full flex-row items-center self-start gap-1.5 ${sizeClass[size]} ${bgClass}`
  const textVariant = textVariantMap[size]

  const content = (
    <View className={containerClass}>
      {leftIcon}
      <Typography variant={textVariant} weight="semibold" color={textColor as 'white' | 'primary' | 'muted' | 'accent'}>
        {children}
      </Typography>
      {rightIcon}
    </View>
  )

  if (!onPress) return content

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
      >
        {content}
      </Pressable>
    </Animated.View>
  )
}
