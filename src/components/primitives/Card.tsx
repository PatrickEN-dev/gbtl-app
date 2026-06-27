
import React from 'react'
import { View, type ViewStyle } from 'react-native'
import { useThemeColors } from '@/hooks/useThemeColors'

interface CardRootProps {
  variant?: 'surface' | 'elevated' | 'flat'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'card' | 'pill' | 'lg' | 'none'
  className?: string
  style?: ViewStyle | ViewStyle[]
  children: React.ReactNode
}

const variantClass: Record<NonNullable<CardRootProps['variant']>, string> = {
  surface: 'bg-surface',
  elevated: 'bg-surface',
  flat: 'bg-transparent',
}

const paddingClass: Record<NonNullable<CardRootProps['padding']>, string> = {
  none: '',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
}

const roundedClass: Record<NonNullable<CardRootProps['rounded']>, string> = {
  card: 'rounded-card',
  pill: 'rounded-pill',
  lg: 'rounded-2xl',
  none: '',
}

function Root({
  variant = 'elevated',
  padding = 'md',
  rounded = 'card',
  className: userClassName,
  style: userStyle,
  children,
}: CardRootProps) {
  const colors = useThemeColors()

  const shadow: ViewStyle =
    variant === 'elevated'
      ? { shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }
      : {}

  const computedClassName = [variantClass[variant], paddingClass[padding], roundedClass[rounded], userClassName]
    .filter(Boolean)
    .join(' ')

  const mergedStyle = [shadow, ...(Array.isArray(userStyle) ? userStyle : userStyle ? [userStyle] : [])].filter(
    (s): s is ViewStyle => Boolean(s && Object.keys(s).length > 0),
  )

  return (
    <View className={computedClassName} style={mergedStyle.length > 0 ? mergedStyle : undefined}>
      {children}
    </View>
  )
}

interface CardBodyProps {
  gap?: 'sm' | 'md' | 'lg'
  className?: string
  children: React.ReactNode
}

const gapClass: Record<NonNullable<CardBodyProps['gap']>, string> = {
  sm: '2',
  md: '3',
  lg: '4',
}

function Body({ gap = 'md', className, children }: CardBodyProps) {
  return (
    <View className={`gap-${gapClass[gap]}${className ? ` ${className}` : ''}`}>
      {children}
    </View>
  )
}

interface CardHeaderProps {
  children: React.ReactNode
}

function Header({ children }: CardHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-3">
      {children}
    </View>
  )
}

interface CardFooterProps {
  children: React.ReactNode
}

function Footer({ children }: CardFooterProps) {
  return (
    <View className="flex-row items-center justify-end gap-2 mt-3">
      {children}
    </View>
  )
}

export const Card = { Root, Body, Header, Footer }
