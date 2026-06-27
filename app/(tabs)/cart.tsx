// app/(tabs)/cart.tsx
import React, { useState } from 'react'
import { View, FlatList, Alert, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { ShoppingBag } from 'lucide-react-native'
import ScreenWrapper from '@/components/layout/ScreenWrapper'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import CartItemComponent from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import Typography from '@/components/ui/Typography'
import Pill from '@/components/primitives/Pill'
import { useThemeColors } from '@/hooks/useThemeColors'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useCartStore } from '@/store/cartStore'
import { useStripeCheckout } from '@/services/stripe'
import { useTranslation } from '@/lib/i18n'

export default function CartScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const { items, removeItem, total } = useCart()
  const { isAuthenticated, user } = useAuth()
  const colors = useThemeColors()
  const clearCart = useCartStore((s) => s.clearCart)
  const { checkout } = useStripeCheckout()
  const [busy, setBusy] = useState(false)

  async function handleCheckout() {
    if (!isAuthenticated) {
      router.push('/(auth)/login')
      return
    }
    if (total <= 0) return

    setBusy(true)
    const result = await checkout({
      amount: total,
      currency: 'usd',
      customerEmail: user?.email,
      description: `GBTL order — ${items.length} item(s)`,
    })
    setBusy(false)

    if (result.ok) {
      clearCart()
      Alert.alert('Thanks for your purchase!', 'Your order has been placed.')
      router.replace('/(tabs)')
    } else if (result.error) {
      Alert.alert('Checkout failed', result.error)
    }
  }

  return (
    <ScreenWrapper header={<Header showBack roundedIcons title={t('cart.title')} />}>
      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title={t('cart.empty')}
          description={t('cart.emptyDescription')}
          action={{
            label: t('cart.browseCollection'),
            onPress: () => router.push('/(tabs)/collection'),
          }}
        />
      ) : (
        <View className="flex-1">
          {/* "My Cart" + Add to Checkout row */}
          <View className="px-4 pt-4 pb-3 flex-row items-center justify-between">
            <Typography variant="heading3" weight="semibold">{t('cart.myCart')}</Typography>
            <Pill
              variant="solid"
              tone="primary"
              size="md"
              leftIcon={<ShoppingBag size={14} color={colors.surface} />}
              onPress={handleCheckout}
            >
              {t('cart.addToCheckout')}
            </Pill>
          </View>
          <FlatList
            data={items}
            keyExtractor={(i) =>
              `${i.product.id}-${i.selectedSize}-${i.selectedColor.hex}`
            }
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
            showsVerticalScrollIndicator={false}
            className="flex-1"
            renderItem={({ item }) => (
              <CartItemComponent
                item={item}
                onRemove={() =>
                  removeItem(item.product.id, item.selectedSize, item.selectedColor.hex)
                }
              />
            )}
          />
          {/* Bottom block — paddingBottom 96 clears the floating tab pill */}
          <View className="px-4 pt-2 gap-4" style={{ paddingBottom: 96 }}>
            <CartSummary />
            <Button
              variant="primary"
              fullWidth
              rounded="pill"
              loading={busy}
              onPress={handleCheckout}
            >
              {t('cart.checkout')}
            </Button>
            {/* Footer legal links + account management */}
            <View className="flex-row items-center justify-center gap-3 mt-1">
              <FooterLink label={t('auth.termsLink')} onPress={() => router.push('/terms')} />
              <Typography variant="caption" color="muted">·</Typography>
              <FooterLink label={t('auth.privacyLink')} onPress={() => router.push('/privacy')} />
              {isAuthenticated && (
                <>
                  <Typography variant="caption" color="muted">·</Typography>
                  <FooterLink label={t('legal.deleteAccountTitle')} onPress={() => router.push('/delete-account')} />
                </>
              )}
            </View>
          </View>
        </View>
      )}
    </ScreenWrapper>
  )
}

function FooterLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={6}>
      <Typography variant="caption" color="muted">{label}</Typography>
    </Pressable>
  )
}
