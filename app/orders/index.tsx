import React from 'react'
import { View, FlatList, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { Package } from 'lucide-react-native'
import ScreenWrapper from '@/components/layout/ScreenWrapper'
import Header from '@/components/layout/Header'
import Typography from '@/components/ui/Typography'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import { useOrders } from '@/hooks/useOrders'
import { useTranslation } from '@/lib/i18n'
import { formatCurrency, formatDate, formatOrderId } from '@/lib/format'
import { useThemeColors } from '@/hooks/useThemeColors'
import type { Order, OrderStatus } from '@/types'

const STATUS_VARIANT: Record<
  OrderStatus,
  'accent' | 'success' | 'warning' | 'error' | 'neutral'
> = {
  pending: 'neutral',
  paid: 'accent',
  shipped: 'accent',
  delivered: 'success',
  canceled: 'neutral',
  refunded: 'warning',
}

function OrderCard({ order, onPress }: { order: Order; onPress: () => void }) {
  const { t } = useTranslation()
  const colors = useThemeColors()
  const itemCount = order.items.reduce((n, i) => n + i.quantity, 0)
  return (
    <Pressable
      onPress={onPress}
      className="bg-surface rounded-2xl p-4 mb-3"
      style={{
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className="flex-row justify-between items-start mb-2">
        <Typography variant="heading3">
          {t('orders.orderId', { id: formatOrderId(order.id) })}
        </Typography>
        <Badge variant={STATUS_VARIANT[order.status]}>
          {t(`orders.status.${order.status}`)}
        </Badge>
      </View>
      <Typography variant="body-sm" color="muted">
        {t('orders.placedOn', { date: formatDate(order.createdAt) })}
      </Typography>
      <View className="flex-row justify-between items-baseline mt-3">
        <Typography variant="body-sm" color="muted">
          {t('orders.items', { count: itemCount })}
        </Typography>
        <Typography variant="price">{formatCurrency(order.total)}</Typography>
      </View>
    </Pressable>
  )
}

export default function OrdersScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const { data: orders = [] } = useOrders()

  return (
    <ScreenWrapper header={<Header showBack roundedIcons title={t('orders.title')} />}>
      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title={t('orders.empty')}
          description={t('orders.emptyDescription')}
          action={{
            label: t('orders.browse'),
            onPress: () => router.replace('/(tabs)/collection'),
          }}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <OrderCard order={item} onPress={() => router.push(`/orders/${item.id}`)} />
          )}
        />
      )}
    </ScreenWrapper>
  )
}
