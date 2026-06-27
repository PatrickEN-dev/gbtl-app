
import React, { useRef } from 'react'
import { View, Pressable } from 'react-native'
import Animated from 'react-native-reanimated'
import { Swipeable } from 'react-native-gesture-handler'
import { Image } from 'expo-image'
import { Trash2, Minus, Plus, X } from 'lucide-react-native'
import Typography from '@/components/ui/Typography'
import { useFadeInUp } from '@/lib/animations'
import { useCart } from '@/hooks/useCart'
import { useThemeColors } from '@/hooks/useThemeColors'
import { Card } from '@/components/primitives/Card'
import Pill from '@/components/primitives/Pill'
import IconButton from '@/components/primitives/IconButton'
import type { CartItem as CartItemType } from '@/types'


interface Props {
  item: CartItemType
  onRemove: () => void
}


function DeleteAction({ onPress }: { onPress: () => void }) {
  const colors = useThemeColors()
  return (
    <Pressable
      onPress={onPress}
      className="bg-accent justify-center items-center w-20 rounded-r-2xl mb-3"
      accessibilityLabel="Remove item"
      accessibilityRole="button"
    >
      <Trash2 size={22} color={colors.surface} />
      <Typography variant="caption" color="white" className="mt-1">
        Delete
      </Typography>
    </Pressable>
  )
}


function QtyButton({
  onPress,
  icon,
  label,
}: {
  onPress: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <Pressable
      onPress={onPress}
      className="w-7 h-7 rounded-full border border-border items-center justify-center"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      {icon}
    </Pressable>
  )
}


export default function CartItem({ item, onRemove }: Props) {
  const { updateQuantity } = useCart()
  const { animatedStyle } = useFadeInUp()
  const swipeableRef = useRef<Swipeable>(null)
  const colors = useThemeColors()

  const { product, quantity, selectedSize, selectedColor } = item

  const handleDecrement = () => {
    if (quantity <= 1) {
      swipeableRef.current?.close()
      onRemove()
    } else {
      updateQuantity(product.id, selectedSize, selectedColor.hex, quantity - 1)
    }
  }

  const handleIncrement = () => {
    updateQuantity(product.id, selectedSize, selectedColor.hex, quantity + 1)
  }

  const handleDelete = () => {
    swipeableRef.current?.close()
    onRemove()
  }

  return (
    <Animated.View style={animatedStyle}>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={() => <DeleteAction onPress={handleDelete} />}
        rightThreshold={40}
        friction={2}
      >
        <Card.Root variant="elevated" padding="sm" className="flex-row mb-3 relative">

          <View className="absolute top-2 right-2" style={{ zIndex: 1 }}>
            <IconButton
              icon={<X size={14} color={colors.muted} />}
              variant="surface"
              size="sm"
              onPress={onRemove}
              accessibilityLabel="Remove item"
            />
          </View>


          <Image
            source={{ uri: product.images[0] }}
            style={{ width: 60, height: 80, borderRadius: 10 }}
            contentFit="cover"
            accessibilityLabel={product.name}
          />


          <View className="flex-1 ml-3 justify-between">
            <View>
              <Typography
                variant="body"
                weight="semibold"
                numberOfLines={1}
              >
                {product.name}
              </Typography>
              <Typography variant="body-sm" color="muted" className="mt-0.5">
                Size: {selectedSize}
              </Typography>
              <Typography variant="body-sm" color="muted" className="mt-0.5">
                Color: {selectedColor.name}
              </Typography>
            </View>


            <View className="flex-row items-center mt-2">
              <QtyButton
                onPress={handleDecrement}
                icon={<Minus size={14} color={colors.primary} />}
                label="Decrease quantity"
              />
              <Typography variant="body" weight="medium" className="mx-3">
                {String(quantity)}
              </Typography>
              <QtyButton
                onPress={handleIncrement}
                icon={<Plus size={14} color={colors.primary} />}
                label="Increase quantity"
              />
            </View>
          </View>


          <View className="ml-3 items-end justify-end pb-1">
            <Pill variant="solid" tone="primary" size="sm">
              ${product.price.toFixed(2)}
            </Pill>
          </View>
        </Card.Root>
      </Swipeable>
    </Animated.View>
  )
}
