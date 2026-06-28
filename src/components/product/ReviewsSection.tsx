import React from 'react'
import { View } from 'react-native'
import { Star } from 'lucide-react-native'
import Typography from '@/components/ui/Typography'
import { useReviews } from '@/hooks/useReviews'
import { useTranslation } from '@/lib/i18n'
import { useThemeColors } from '@/hooks/useThemeColors'
import { formatDate } from '@/lib/format'

function Stars({ rating }: { rating: number }) {
  const colors = useThemeColors()
  return (
    <View className="flex-row gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          color={colors.accent}
          fill={n <= rating ? colors.accent : 'transparent'}
        />
      ))}
    </View>
  )
}

export default function ReviewsSection({ productId }: { productId: string }) {
  const { t } = useTranslation()
  const { data: reviews, isPending } = useReviews(productId)

  if (isPending) return null
  const list = reviews ?? []

  return (
    <View className="px-4 mt-6">
      <Typography variant="heading3" className="mb-3">
        {t('product.reviews')}
      </Typography>
      {list.length === 0 ? (
        <Typography variant="body-sm" color="muted">
          {t('product.noReviews')}
        </Typography>
      ) : (
        <View className="gap-4">
          {list.map((r) => (
            <View key={r.id} className="border-b border-border pb-3">
              <View className="flex-row justify-between items-center mb-1">
                <Typography variant="body" weight="semibold">
                  {r.userName}
                </Typography>
                <Stars rating={r.rating} />
              </View>
              {r.title ? (
                <Typography variant="body-sm" weight="semibold" className="mb-1">
                  {r.title}
                </Typography>
              ) : null}
              <Typography variant="body-sm" color="muted">
                {r.body}
              </Typography>
              <Typography variant="caption" color="muted" className="mt-1">
                {formatDate(r.createdAt)}
              </Typography>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
