import React, { useCallback, useMemo, useState } from 'react'
import { Alert, View, TextInput } from 'react-native'
import { Easing } from 'react-native-reanimated'
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetFlatList,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ShoppingBag, Tag, X } from 'lucide-react-native'
import Typography from '@/components/ui/Typography'
import Pill from '@/components/primitives/Pill'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import CartSummary from '@/components/cart/CartSummary'
import CompactCartItem from '@/components/cart/CompactCartItem'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { cartSheetRef, cartUI } from '@/store/cartUIStore'
import { useCartStore } from '@/store/cartStore'
import { useAddressesStore } from '@/store/addressesStore'
import { useCouponStore } from '@/store/couponStore'
import { useStripeCheckout } from '@/services/stripe'
import { validateCoupon } from '@/services/coupons'
import { createOrder } from '@/services/orders'
import { useThemeColors } from '@/hooks/useThemeColors'
import { useTranslation } from '@/lib/i18n'
import { track } from '@/lib/analytics'
import { logger } from '@/lib/logger'
import { rateLimit } from '@/lib/rateLimit'
import type { CartItem as CartItemType } from '@/types'

const Backdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop
    {...props}
    appearsOnIndex={0}
    disappearsOnIndex={-1}
    opacity={0.45}
    pressBehavior="close"
  />
)

export default function CartBottomSheet() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const colors = useThemeColors()
  const { items, removeItem, subtotal, deliveryFee, discount, total, coupon } = useCart()
  const { isAuthenticated, user } = useAuth()
  const clearCart = useCartStore((s) => s.clearCart)
  const applyCoupon = useCouponStore((s) => s.apply)
  const clearCoupon = useCouponStore((s) => s.clear)
  const defaultAddress = useAddressesStore((s) => s.addresses.find((a) => a.isDefault))
  const { checkout } = useStripeCheckout()
  const [busy, setBusy] = useState(false)
  const [couponInput, setCouponInput] = useState('')

  const snapPoints = useMemo(() => ['62%', '92%'], [])
  const animationConfigs = useMemo(
    () => ({
      duration: 520,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    }),
    [],
  )

  async function handleApplyCoupon() {
    const result = await validateCoupon(couponInput, subtotal)
    if (result.ok) {
      applyCoupon(result.coupon)
      track('coupon_applied', { code: result.coupon.code })
      setCouponInput('')
    } else {
      track('coupon_invalid', { code: couponInput })
      Alert.alert(t('cart.couponInvalid'), result.reason)
    }
  }

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      cartUI.close()
      router.push('/(auth)/login')
      return
    }
    if (total <= 0) return
    // Local rate-limit: máx 4 tentativas/min para evitar criação massiva de PaymentIntent
    if (!rateLimit('checkout:start', { perMinute: 4, burst: 2 })) {
      Alert.alert(t('cart.checkoutFailedTitle'), 'Aguarde antes de tentar novamente.')
      return
    }
    setBusy(true)
    const result = await checkout({
      amount: total,
      currency: 'brl',
      customerEmail: user?.email,
      description: `GBTL — ${items.length} item(s)`,
      metadata: { itemCount: String(items.length) },
    })
    setBusy(false)

    if (result.ok) {
      try {
        if (user) {
          await createOrder({
            userId: user.id,
            items,
            subtotal,
            shipping: deliveryFee,
            discount,
            total,
            paymentIntentId: result.paymentIntentId,
            shippingAddress: defaultAddress,
            coupon,
          })
        }
      } catch (e) {
        logger.error(e, { op: 'cart.create_order_after_payment' })
      }
      clearCart()
      clearCoupon()
      cartUI.close()
      Alert.alert(t('cart.checkoutSuccessTitle'), t('cart.checkoutSuccessBody'))
    } else if (!result.canceled && result.error) {
      Alert.alert(t('cart.checkoutFailedTitle'), result.error)
    }
  }

  const renderItem = useCallback(
    ({ item }: { item: CartItemType }) => (
      <CompactCartItem
        item={item}
        onRemove={() =>
          removeItem(item.product.id, item.selectedSize, item.selectedColor.hex)
        }
      />
    ),
    [removeItem],
  )

  const keyExtractor = useCallback(
    (i: CartItemType) => `${i.product.id}-${i.selectedSize}-${i.selectedColor.hex}`,
    [],
  )

  return (
    <BottomSheetModal
      ref={cartSheetRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={Backdrop}
      backgroundStyle={{
        backgroundColor: colors.bg,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
      }}
      handleIndicatorStyle={{
        backgroundColor: colors.muted,
        width: 44,
        opacity: 0.5,
      }}
      enablePanDownToClose
      enableDynamicSizing={false}
      animationConfigs={animationConfigs}
      keyboardBehavior="interactive"
    >
      <View className="flex-1 px-5 pt-2">
        <View className="flex-row items-center justify-between pb-4">
          <Typography variant="heading2" weight="semibold">
            {t('cart.myCart')}
          </Typography>
          {items.length > 0 && (
            <Pill
              variant="solid"
              tone="primary"
              size="md"
              leftIcon={<ShoppingBag size={14} color={colors.surface} />}
              onPress={handleCheckout}
            >
              {t('cart.addToCheckout')}
            </Pill>
          )}
        </View>

        {items.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <EmptyState
              icon={ShoppingBag}
              title={t('cart.empty')}
              description={t('cart.emptyDescription')}
              action={{
                label: t('cart.browseCollection'),
                onPress: () => {
                  cartUI.close()
                  router.push('/(tabs)/collection')
                },
              }}
            />
          </View>
        ) : (
          <BottomSheetFlatList
            data={items}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        )}

        {items.length > 0 && (
          <View
            className="pt-3 pb-2"
            style={{ paddingBottom: Math.max(insets.bottom, 12) }}
          >
            <View className="flex-row items-center gap-2 mb-3">
              <View className="flex-1 flex-row items-center bg-surface rounded-pill px-4 h-11 border border-border">
                <Tag size={16} color={colors.muted} />
                <TextInput
                  value={coupon?.code ?? couponInput}
                  onChangeText={setCouponInput}
                  editable={!coupon}
                  autoCapitalize="characters"
                  placeholder={t('cart.couponPlaceholder') ?? ''}
                  placeholderTextColor={colors.muted}
                  className="flex-1 ml-2"
                  style={{ color: colors.primary, fontSize: 14 }}
                />
                {coupon ? (
                  <Pill
                    variant="ghost"
                    tone="primary"
                    size="sm"
                    leftIcon={<X size={12} color={colors.primary} />}
                    onPress={clearCoupon}
                  >
                    {t('cart.couponRemove')}
                  </Pill>
                ) : (
                  <Pill
                    variant="solid"
                    tone="primary"
                    size="sm"
                    onPress={handleApplyCoupon}
                  >
                    {t('cart.couponApply')}
                  </Pill>
                )}
              </View>
            </View>

            <View
              className="bg-surface rounded-2xl px-4 py-4 mb-3"
              style={{
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <CartSummary />
            </View>
            <Button
              variant="primary"
              fullWidth
              rounded="pill"
              size="lg"
              loading={busy}
              onPress={handleCheckout}
            >
              {t('cart.checkout')}
            </Button>
          </View>
        )}
      </View>
    </BottomSheetModal>
  )
}
