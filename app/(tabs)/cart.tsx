// app/(tabs)/cart.tsx
import React from 'react'
import { View, FlatList } from 'react-native'
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useRouter } from 'expo-router'
import { ShoppingBag } from 'lucide-react-native'
import ScreenWrapper from '@/components/layout/ScreenWrapper'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import CartItemComponent from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import CheckoutForm from '@/components/forms/CheckoutForm'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useBottomSheet } from '@/hooks/useBottomSheet'

export default function CartScreen() {
  const router = useRouter()
  const { items, removeItem } = useCart()
  const { isAuthenticated } = useAuth()
  const { ref, present } = useBottomSheet()

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login')
    } else {
      present()
    }
  }

  return (
    <ScreenWrapper header={<Header title="Cart" />}>
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
        <BottomSheetScrollView>
          <CheckoutForm />
        </BottomSheetScrollView>
      </BottomSheetModal>
    </ScreenWrapper>
  )
}
