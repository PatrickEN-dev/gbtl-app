import React from 'react'
import { View } from 'react-native'
import Typography from '@/components/ui/Typography'
import { useCart } from '@/hooks/useCart'
import { useTranslation } from '@/lib/i18n'
import { formatCurrency } from '@/lib/format'

function SummaryRow({
  label,
  value,
  bold = false,
  tone = 'muted',
}: {
  label: string
  value: string
  bold?: boolean
  tone?: 'muted' | 'accent'
}) {
  return (
    <View className="flex-row justify-between items-center">
      <Typography variant="body" color={tone} weight={bold ? 'bold' : 'regular'}>
        {label}
      </Typography>
      <Typography
        variant={bold ? 'price' : 'body'}
        color={tone === 'accent' ? 'accent' : 'primary'}
        weight={bold ? 'bold' : 'medium'}
      >
        {value}
      </Typography>
    </View>
  )
}

export default function CartSummary() {
  const { subtotal, deliveryFee, discount, total, coupon } = useCart()
  const { t } = useTranslation()

  return (
    <View className="gap-3">
      <SummaryRow label={t('cart.subtotal')} value={formatCurrency(subtotal)} />
      <SummaryRow label={t('cart.deliveryFee')} value={formatCurrency(deliveryFee)} />
      {discount > 0 ? (
        <SummaryRow
          label={`${t('cart.discount')}${coupon ? ` (${coupon.code})` : ''}`}
          value={`- ${formatCurrency(discount)}`}
          tone="accent"
        />
      ) : null}
      <View className="h-px bg-border" />
      <SummaryRow label={t('cart.totalPrice')} value={formatCurrency(total)} bold />
    </View>
  )
}
