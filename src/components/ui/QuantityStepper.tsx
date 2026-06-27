// src/components/ui/QuantityStepper.tsx
import React from 'react'
import { View, Pressable } from 'react-native'
import Animated from 'react-native-reanimated'
import { Minus, Plus } from 'lucide-react-native'
import Typography from '@/components/ui/Typography'
import { useThemeColors } from '@/hooks/useThemeColors'
import { usePressScale } from '@/lib/animations'

// ─── Types ───────────────────────────────────────────────────────────────────

interface QuantityStepperProps {
  value: number
  onChange: (n: number) => void
  min?: number
  max?: number
}

// ─── Sub-component: StepButton ───────────────────────────────────────────────

interface StepButtonProps {
  onPress: () => void
  disabled: boolean
  variant: 'minus' | 'plus'
}

function StepButton({ onPress, disabled, variant }: StepButtonProps) {
  const { animatedStyle, handlePressIn, handlePressOut } = usePressScale(0.9)
  const colors = useThemeColors()

  const isMinus = variant === 'minus'

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        className={[
          'w-8 h-8 rounded-full items-center justify-center',
          isMinus
            ? 'bg-surface border border-border'
            : 'bg-primary',
          disabled ? 'opacity-40' : 'opacity-100',
        ].join(' ')}
      >
        {isMinus ? (
          <Minus size={14} color={colors.primary} />
        ) : (
          <Plus size={14} color={colors.surface} />
        )}
      </Pressable>
    </Animated.View>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantityStepperProps) {
  const handleDecrement = () => onChange(Math.max(min, value - 1))
  const handleIncrement = () => onChange(Math.min(max, value + 1))

  const label = value.toString().padStart(2, '0')

  return (
    <View className="flex-row items-center gap-2">
      <StepButton
        variant="minus"
        onPress={handleDecrement}
        disabled={value <= min}
      />

      <Typography variant="body" weight="semibold" color="primary">
        {label}
      </Typography>

      <StepButton
        variant="plus"
        onPress={handleIncrement}
        disabled={value >= max}
      />
    </View>
  )
}
