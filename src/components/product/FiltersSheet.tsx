import React, { useCallback, useMemo, useRef } from 'react'
import { View } from 'react-native'
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet'
import Typography from '@/components/ui/Typography'
import Pill from '@/components/primitives/Pill'
import Button from '@/components/ui/Button'
import { useThemeColors } from '@/hooks/useThemeColors'
import { useTranslation } from '@/lib/i18n'
import type { Product } from '@/types'

export interface Filters {
  categories: Product['category'][]
  onSale: boolean
  priceMax: number | null
}

export const initialFilters: Filters = {
  categories: [],
  onSale: false,
  priceMax: null,
}

const PRICE_BUCKETS = [50, 100, 200, 500] as const
const CATEGORIES: Product['category'][] = ['men', 'women', 'kids']

const Backdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop
    {...props}
    appearsOnIndex={0}
    disappearsOnIndex={-1}
    opacity={0.45}
    pressBehavior="close"
  />
)

interface FiltersSheetProps {
  value: Filters
  onChange: (next: Filters) => void
  sheetRef: React.RefObject<BottomSheetModal | null>
}

export default function FiltersSheet({ value, onChange, sheetRef }: FiltersSheetProps) {
  const { t } = useTranslation()
  const colors = useThemeColors()
  const localRef = useRef(value)
  localRef.current = value

  const snapPoints = useMemo(() => ['55%'], [])

  const toggleCategory = useCallback(
    (cat: Product['category']) => {
      const next = value.categories.includes(cat)
        ? value.categories.filter((c) => c !== cat)
        : [...value.categories, cat]
      onChange({ ...value, categories: next })
    },
    [value, onChange],
  )

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      backdropComponent={Backdrop}
      backgroundStyle={{
        backgroundColor: colors.bg,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
      }}
      handleIndicatorStyle={{ backgroundColor: colors.muted, width: 44, opacity: 0.5 }}
      enablePanDownToClose
      enableDynamicSizing={false}
    >
      <BottomSheetView className="flex-1 px-5 pt-2 pb-6">
        <Typography variant="heading2" className="mb-4">
          {t('collection.filters')}
        </Typography>

        <Typography variant="heading3" className="mb-2">
          {t('collection.filter.category')}
        </Typography>
        <View className="flex-row flex-wrap gap-2 mb-4">
          {CATEGORIES.map((c) => (
            <Pill
              key={c}
              variant={value.categories.includes(c) ? 'solid' : 'ghost'}
              tone="primary"
              size="md"
              onPress={() => toggleCategory(c)}
            >
              {t(`home.categories.${c}`)}
            </Pill>
          ))}
        </View>

        <Typography variant="heading3" className="mb-2">
          {t('collection.filter.priceRange')}
        </Typography>
        <View className="flex-row flex-wrap gap-2 mb-4">
          <Pill
            variant={value.priceMax === null ? 'solid' : 'ghost'}
            tone="primary"
            size="md"
            onPress={() => onChange({ ...value, priceMax: null })}
          >
            All
          </Pill>
          {PRICE_BUCKETS.map((p) => (
            <Pill
              key={p}
              variant={value.priceMax === p ? 'solid' : 'ghost'}
              tone="primary"
              size="md"
              onPress={() => onChange({ ...value, priceMax: p })}
            >
              {`≤ R$ ${p}`}
            </Pill>
          ))}
        </View>

        <View className="flex-row items-center gap-2 mb-6">
          <Pill
            variant={value.onSale ? 'solid' : 'ghost'}
            tone="primary"
            size="md"
            onPress={() => onChange({ ...value, onSale: !value.onSale })}
          >
            {t('collection.filter.onSale')}
          </Pill>
        </View>

        <View className="flex-row gap-3 mt-auto">
          <View className="flex-1">
            <Button
              variant="outline"
              fullWidth
              rounded="pill"
              onPress={() => onChange(initialFilters)}
            >
              {t('collection.filter.clear')}
            </Button>
          </View>
          <View className="flex-1">
            <Button
              variant="primary"
              fullWidth
              rounded="pill"
              onPress={() => sheetRef.current?.dismiss()}
            >
              {t('collection.filter.apply')}
            </Button>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  )
}
