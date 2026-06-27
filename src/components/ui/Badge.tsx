
import React from 'react'
import { View } from 'react-native'
import Typography from '@/components/ui/Typography'

type BadgeVariant = 'accent' | 'success' | 'warning' | 'error' | 'neutral'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  children: React.ReactNode
}

const variantBgMap: Record<BadgeVariant, string> = {
  accent:  'bg-accent',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error:   'bg-red-500',
  neutral: 'bg-border',
}

const variantTextColorMap: Record<BadgeVariant, 'white' | 'primary'> = {
  accent:  'white',
  success: 'white',
  warning: 'white',
  error:   'white',
  neutral: 'primary',
}

const sizeContainerMap: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5',
  md: 'px-3 py-1',
}

const sizeTextVariantMap: Record<BadgeSize, 'caption' | 'body-sm'> = {
  sm: 'caption',
  md: 'body-sm',
}

export default function Badge({
  variant = 'accent',
  size = 'md',
  children,
}: BadgeProps) {
  const bgClass = variantBgMap[variant]
  const textColor = variantTextColorMap[variant]
  const containerClass = sizeContainerMap[size]
  const textVariant = sizeTextVariantMap[size]

  return (
    <View className={`rounded-full self-start ${bgClass} ${containerClass}`}>
      <Typography variant={textVariant} color={textColor}>
        {children}
      </Typography>
    </View>
  )
}
