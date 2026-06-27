// app/(tabs)/cart.tsx
import React from 'react'
import { View, FlatList, Pressable } from 'react-native'
import Animated from 'react-native-reanimated'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useRouter } from 'expo-router'
import { ShoppingBag } from 'lucide-react-native'
import ScreenWrapper from '@/components/layout/ScreenWrapper'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import CartItemComponent from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import CheckoutForm from '@/components/forms/CheckoutForm'
import Typography from '@/components/ui/Typography'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useBottomSheet } from '@/hooks/useBottomSheet'
import { usePressScale } from '@/lib/animations'
import { Colors } from '@/constants/tokens'

export default function CartScreen() {
  const router = useRouter()
  const { items, removeItem } = useCart()
  const { isAuthenticated } = useAuth()
  const { ref, present } = useBottomSheet()
  const ctaPress = usePressScale(0.95)

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login')
    } else {
      present()
    }
  }

  return (
    <ScreenWrapper header={<Header title="My Cart" roundedIcons />}>
      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add items to start shopping"
          action={{
            label: 'Browse Collection',
            onPress: () => router.push('/(tabs)/collection'),
          }}
        />
      ) : (
        <View className="flex-1">
          <View
            className="mx-4 mt-4 mb-2 bg-surface rounded-card p-4 flex-row items-center justify-between"
            style={{
              shadowColor: Colors.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Typography variant="heading3" weight="semibold">My Cart</Typography>
            <Pressable onPress={handleCheckout}>
              <Animated.View
                style={ctaPress.animatedStyle}
                className="flex-row items-center gap-2 bg-primary rounded-pill px-4 h-9"
              >
                <ShoppingBag size={14} color={Colors.surface} />
                <Typography variant="body-sm" weight="semibold" color="white">Add to Checkout</Typography>
              </Animated.View>
            </Pressable>
          </View>
          <FlatList
            data={items}
            keyExtractor={(i) =>
              `${i.product.id}-${i.selectedSize}-${i.selectedColor.hex}`
            }
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
            className="flex-1"
            renderItem={({ item }) => (
              <CartItemComponent
                item={item}
                onRemove={() =>
                  removeItem(
                    item.product.id,
                    item.selectedSize,
                    item.selectedColor.hex,
                  )
                }
              />
            )}
          />
          <View className="px-4 pb-4 gap-3">
            <CartSummary />
            <Button variant="primary" fullWidth onPress={handleCheckout}>
              Checkout
            </Button>
          </View>
        </View>
      )}
      <BottomSheetModal ref={ref} snapPoints={['75%', '90%']}>
        <CheckoutForm />
      </BottomSheetModal>
    </ScreenWrapper>
  )
}
