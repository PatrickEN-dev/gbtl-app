
import React from 'react'
import { View } from 'react-native'
import Typography from '@/components/ui/Typography'
import { useCart } from '@/hooks/useCart'

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`
}

function SummaryRow({
  label,
  value,
  bold = false,
}: {
  label: string
  value: string
  bold?: boolean
}) {
  return (
    <View className="flex-row justify-between items-center">
      <Typography variant="body" color="muted" weight={bold ? 'bold' : 'regular'}>
        {label}
      </Typography>
      <Typography
        variant={bold ? 'price' : 'body'}
        color="primary"
        weight={bold ? 'bold' : 'medium'}
      >
        {value}
      </Typography>
    </View>
  )
}

export default function CartSummary() {
  const { subtotal, deliveryFee, total } = useCart()

  return (
    <View className="gap-3">
      <SummaryRow label="Sub-total" value={formatCurrency(subtotal)} />
      <SummaryRow label="Delivery Fee" value={formatCurrency(deliveryFee)} />
      <View className="h-px bg-border" />
      <SummaryRow label="Total Price" value={formatCurrency(total)} bold />
    </View>
  )
}
