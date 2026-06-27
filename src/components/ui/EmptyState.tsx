// src/components/ui/EmptyState.tsx
import React from 'react'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'
import { LucideIcon } from 'lucide-react-native'
import Typography from '@/components/ui/Typography'
import Button from '@/components/ui/Button'
import { useScaleIn } from '@/lib/animations'
import { useThemeColors } from '@/hooks/useThemeColors'

interface EmptyStateAction {
  label: string
  onPress: () => void
}

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: EmptyStateAction
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  const { animatedStyle } = useScaleIn(0)
  const colors = useThemeColors()

  return (
    <Animated.View
      style={animatedStyle}
      className="flex-1 items-center justify-center px-8 py-12"
    >
      <View className="items-center gap-4">
        <Icon size={48} color={colors.muted} />

        <View className="items-center gap-2">
          <Typography variant="heading3" color="primary" className="text-center">
            {title}
          </Typography>

          {description ? (
            <Typography variant="body-sm" color="muted" className="text-center">
              {description}
            </Typography>
          ) : null}
        </View>

        {action ? (
          <View className="mt-2 w-full">
            <Button variant="outline" onPress={action.onPress} fullWidth>
              {action.label}
            </Button>
          </View>
        ) : null}
      </View>
    </Animated.View>
  )
}
