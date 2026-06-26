// src/components/cart/CartSummary.tsx
import React from 'react'
import { View } from 'react-native'
import Typography from '@/components/ui/Typography'
import { useCart } from '@/hooks/useCart'
import { Colors } from '@/constants/tokens'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`
}

// ─── Row ─────────────────────────────────────────────────────────────────────

function SummaryRow({
  label,
  value,
  valueAccent = false,
  valueVariant = 'body',
  bold = false,
}: {
  label: string
  value: string
  valueAccent?: boolean
  valueVariant?: 'body' | 'price'
  bold?: boolean
}) {
  return (
    <View className="flex-row justify-between items-center">
      <Typography
        variant="body"
        color="muted"
        weight={bold ? 'bold' : 'regular'}
      >
        {label}
      </Typography>
      <Typography
        variant={valueVariant}
        color={valueAccent ? 'accent' : 'primary'}
        weight={bold ? 'bold' : 'medium'}
      >
        {value}
      </Typography>
    </View>
  )
}

// ─── Divider ─────────────────────────────────────────────────────────────────

function Separator() {
  return <View className="h-px bg-border my-3" />
}

// ─── CartSummary ──────────────────────────────────────────────────────────────

export default function CartSummary() {
  const { subtotal, deliveryFee, total } = useCart()

  const isFreeDelivery = deliveryFee === 0
  const amountToFree = 200 - subtotal

  return (
    <View
      className="bg-surface rounded-2xl p-4"
      style={{
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <Typography variant="heading3" weight="semibold" className="mb-4">
        Order Summary
      </Typography>

      <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />

      <View className="mt-2">
        <SummaryRow
          label="Delivery"
          value={isFreeDelivery ? 'FREE' : formatCurrency(deliveryFee)}
          valueAccent={isFreeDelivery}
        />
      </View>

      {/* FREE delivery nudge */}
      {!isFreeDelivery && (
        <View className="bg-bg rounded-xl px-3 py-2 mt-3">
          <Typography variant="caption" color="muted">
            Add{' '}
            <Typography variant="caption" color="accent">
              {formatCurrency(amountToFree)}
            </Typography>
            {' '}more for FREE delivery
          </Typography>
        </View>
      )}

      <Separator />

      <SummaryRow
        label="Total"
        value={formatCurrency(total)}
        valueVariant="price"
        bold
      />
    </View>
  )
}
