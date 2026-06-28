import React from 'react'
import { Pressable, View } from 'react-native'
import Animated, {
  LinearTransition,
  FadeInRight,
  FadeOutLeft,
} from 'react-native-reanimated'
import { Image } from 'expo-image'
import { X } from 'lucide-react-native'
import Typography from '@/components/ui/Typography'
import Pill from '@/components/primitives/Pill'
import { useThemeColors } from '@/hooks/useThemeColors'
import { usePressScale } from '@/lib/animations'
import { formatCurrency } from '@/lib/format'
import type { CartItem as CartItemType } from '@/types'

interface Props {
  item: CartItemType
  onRemove: () => void
}

export default function CompactCartItem({ item, onRemove }: Props) {
  const colors = useThemeColors()
  const { animatedStyle, handlePressIn, handlePressOut } = usePressScale(0.94)
  const { product, selectedSize, selectedColor, quantity } = item

  return (
    <Animated.View
      layout={LinearTransition.springify().damping(22).stiffness(110).mass(1)}
      entering={FadeInRight.duration(520)}
      exiting={FadeOutLeft.duration(380)}
      className="flex-row items-center bg-surface rounded-2xl px-3 py-3 mb-3"
      style={{
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className="w-14 h-14 rounded-xl overflow-hidden bg-bg">
        <Image
          source={{ uri: product.images[0] }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
      </View>

      <View className="flex-1 ml-3">
        <Typography variant="body" weight="semibold" numberOfLines={1}>
          {product.name}
        </Typography>
        <Typography variant="body-sm" color="muted" numberOfLines={1} className="mt-0.5">
          {`Size ${selectedSize}, ${selectedColor.name}`}
          {quantity > 1 ? `  ·  x${quantity}` : ''}
        </Typography>
      </View>

      <View className="ml-2 items-end justify-between" style={{ height: 56 }}>
        <Pressable
          onPress={onRemove}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          hitSlop={10}
          accessibilityLabel="Remove item"
          accessibilityRole="button"
        >
          <Animated.View style={animatedStyle}>
            <X size={16} color={colors.muted} />
          </Animated.View>
        </Pressable>
        <Pill variant="solid" tone="primary" size="sm">
          {formatCurrency(product.price * quantity)}
        </Pill>
      </View>
    </Animated.View>
  )
}
