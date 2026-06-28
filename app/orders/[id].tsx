import React from 'react'
import { View, ScrollView, Image } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { AlertCircle } from 'lucide-react-native'
import ScreenWrapper from '@/components/layout/ScreenWrapper'
import Header from '@/components/layout/Header'
import Typography from '@/components/ui/Typography'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import { useOrder } from '@/hooks/useOrders'
import { useTranslation } from '@/lib/i18n'
import { formatCurrency, formatDate, formatOrderId } from '@/lib/format'
import { useThemeColors } from '@/hooks/useThemeColors'
import type { OrderItem, OrderStatus } from '@/types'

const STATUS_VARIANT: Record<OrderStatus, 'accent' | 'success' | 'warning' | 'neutral'> =
  {
    pending: 'neutral',
    paid: 'accent',
    shipped: 'accent',
    delivered: 'success',
    canceled: 'neutral',
    refunded: 'warning',
  }

function ItemRow({ item }: { item: OrderItem }) {
  return (
    <View className="flex-row gap-3 py-3 border-b border-border">
      <Image
        source={{ uri: item.image }}
        style={{ width: 64, height: 80, borderRadius: 8 }}
      />
      <View className="flex-1">
        <Typography variant="body" weight="semibold">
          {item.name}
        </Typography>
        <Typography variant="body-sm" color="muted">
          {item.size} · {item.colorName}
        </Typography>
        <View className="flex-row justify-between mt-1">
          <Typography variant="body-sm" color="muted">
            {item.quantity} ×
          </Typography>
          <Typography variant="body" weight="semibold">
            {formatCurrency(item.unitPrice * item.quantity)}
          </Typography>
        </View>
      </View>
    </View>
  )
}

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { t } = useTranslation()
  const colors = useThemeColors()
  const { data: order, isPending, isError, refetch } = useOrder(id)

  if (isPending) {
    return (
      <ScreenWrapper
        header={<Header showBack roundedIcons title={t('orders.details')} />}
      >
        <View className="flex-1 items-center justify-center">
          <Typography color="muted">{t('common.loading')}</Typography>
        </View>
      </ScreenWrapper>
    )
  }

  if (isError || !order) {
    return (
      <ScreenWrapper
        header={<Header showBack roundedIcons title={t('orders.details')} />}
      >
        <EmptyState
          icon={AlertCircle}
          title={t('common.error')}
          action={{ label: t('common.tryAgain'), onPress: refetch }}
        />
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper header={<Header showBack roundedIcons title={t('orders.details')} />}>
      <ScrollView className="flex-1 px-4">
        <View
          className="bg-surface rounded-2xl p-4 my-3"
          style={{
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View className="flex-row justify-between items-start mb-2">
            <Typography variant="heading2">#{formatOrderId(order.id)}</Typography>
            <Badge variant={STATUS_VARIANT[order.status]}>
              {t(`orders.status.${order.status}`)}
            </Badge>
          </View>
          <Typography variant="body-sm" color="muted">
            {t('orders.placedOn', { date: formatDate(order.createdAt) })}
          </Typography>
          {order.estimatedDelivery ? (
            <Typography variant="body-sm" color="muted" className="mt-1">
              {t('orders.estimatedDelivery')}: {formatDate(order.estimatedDelivery)}
            </Typography>
          ) : null}
        </View>

        <View className="mb-4">
          {order.items.map((it) => (
            <ItemRow key={`${it.productId}-${it.size}-${it.colorHex}`} item={it} />
          ))}
        </View>

        <View
          className="bg-surface rounded-2xl p-4 mb-6 gap-2"
          style={{
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View className="flex-row justify-between">
            <Typography color="muted">{t('cart.subtotal')}</Typography>
            <Typography>{formatCurrency(order.subtotal)}</Typography>
          </View>
          <View className="flex-row justify-between">
            <Typography color="muted">{t('cart.deliveryFee')}</Typography>
            <Typography>{formatCurrency(order.shipping)}</Typography>
          </View>
          {order.discount > 0 ? (
            <View className="flex-row justify-between">
              <Typography color="accent">{t('cart.discount')}</Typography>
              <Typography color="accent">- {formatCurrency(order.discount)}</Typography>
            </View>
          ) : null}
          <View className="h-px bg-border my-1" />
          <View className="flex-row justify-between">
            <Typography weight="bold">{t('cart.totalPrice')}</Typography>
            <Typography variant="price">{formatCurrency(order.total)}</Typography>
          </View>
        </View>

        {order.shippingAddress ? (
          <View
            className="bg-surface rounded-2xl p-4 mb-6"
            style={{
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Typography variant="heading3" className="mb-2">
              {t('addresses.title')}
            </Typography>
            <Typography>{order.shippingAddress.recipient}</Typography>
            <Typography color="muted">
              {order.shippingAddress.street}, {order.shippingAddress.number}
              {order.shippingAddress.complement
                ? ` — ${order.shippingAddress.complement}`
                : ''}
            </Typography>
            <Typography color="muted">
              {order.shippingAddress.neighborhood} — {order.shippingAddress.city}/
              {order.shippingAddress.state}
            </Typography>
            <Typography color="muted">{order.shippingAddress.zip}</Typography>
          </View>
        ) : null}
      </ScrollView>
    </ScreenWrapper>
  )
}
