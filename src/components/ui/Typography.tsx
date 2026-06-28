import React from 'react'
import { Text } from 'react-native'
import Animated from 'react-native-reanimated'
import type { StyleProp, TextStyle } from 'react-native'

type Variant =
  | 'display'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'body'
  | 'body-sm'
  | 'caption'
  | 'price'

type Weight = 'regular' | 'medium' | 'semibold' | 'bold'

type ColorProp = 'primary' | 'muted' | 'accent' | 'surface' | 'white'

export interface TypographyProps {
  variant?: Variant
  weight?: Weight
  color?: ColorProp
  className?: string
  children: React.ReactNode
  numberOfLines?: number

  animated?: boolean
  style?: StyleProp<TextStyle>
}

const VARIANT_CLASS: Record<Variant, string> = {
  display: 'text-display',
  heading1: 'text-heading1',
  heading2: 'text-heading2',
  heading3: 'text-heading3',
  body: 'text-body',
  'body-sm': 'text-body-sm',
  caption: 'text-caption',
  price: 'text-price',
}

const WEIGHT_CLASS: Record<Weight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const COLOR_CLASS: Record<ColorProp, string> = {
  primary: 'text-primary',
  muted: 'text-muted',
  accent: 'text-accent',
  surface: 'text-surface',
  white: 'text-white',
}

export default function Typography({
  variant = 'body',
  weight,
  color = 'primary',
  className = '',
  children,
  numberOfLines,
  animated = false,
  style,
}: TypographyProps) {
  const classes = [
    VARIANT_CLASS[variant],
    weight ? WEIGHT_CLASS[weight] : null,
    COLOR_CLASS[color],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (animated) {
    return (
      <Animated.Text className={classes} numberOfLines={numberOfLines} style={style}>
        {children}
      </Animated.Text>
    )
  }

  return (
    <Text className={classes} numberOfLines={numberOfLines} style={style}>
      {children}
    </Text>
  )
}
