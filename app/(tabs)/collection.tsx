import React, { useMemo, useRef, useState } from 'react'
import { View, FlatList, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { SlidersHorizontal } from 'lucide-react-native'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import ScreenWrapper from '@/components/layout/ScreenWrapper'
import Header from '@/components/layout/Header'
import Typography from '@/components/ui/Typography'
import ProductGrid from '@/components/product/ProductGrid'
import FiltersSheet, {
  initialFilters,
  type Filters,
} from '@/components/product/FiltersSheet'
import IconButton from '@/components/primitives/IconButton'
import { useProducts } from '@/hooks/useProducts'
import { useThemeColors } from '@/hooks/useThemeColors'
import { useTranslation } from '@/lib/i18n'
import { track } from '@/lib/analytics'
import type { Product } from '@/types'

type SortKey = 'relevance' | 'priceAsc' | 'priceDesc' | 'newest'
const SORT_KEYS: SortKey[] = ['relevance', 'priceAsc', 'priceDesc', 'newest']

function sortProducts(products: Product[], sort: SortKey): Product[] {
  switch (sort) {
    case 'priceAsc':
      return [...products].sort((a, b) => a.price - b.price)
    case 'priceDesc':
      return [...products].sort((a, b) => b.price - a.price)
    case 'newest':
      return [...products].reverse()
    default:
      return products
  }
}

function applyFilters(products: Product[], f: Filters): Product[] {
  return products.filter((p) => {
    if (f.categories.length && !f.categories.includes(p.category)) return false
    if (f.onSale && !p.isSale && !p.originalPrice) return false
    if (f.priceMax !== null && p.price > f.priceMax) return false
    return true
  })
}

export default function CollectionScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const colors = useThemeColors()
  const [sort, setSort] = useState<SortKey>('relevance')
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const filtersRef = useRef<BottomSheetModal | null>(null)
  const { data, isPending, isError, refetch } = useProducts()

  const result = useMemo(() => {
    const filtered = data ? applyFilters(data, filters) : []
    return sortProducts(filtered, sort)
  }, [data, filters, sort])

  const activeFilterCount =
    filters.categories.length +
    (filters.onSale ? 1 : 0) +
    (filters.priceMax !== null ? 1 : 0)

  return (
    <ScreenWrapper
      header={
        <Header
          title={t('collection.title')}
          showCart
          rightElement={
            <IconButton
              icon={<SlidersHorizontal size={18} color={colors.primary} />}
              variant="ghost"
              size="md"
              badge={activeFilterCount > 0 ? activeFilterCount : undefined}
              onPress={() => filtersRef.current?.present()}
              accessibilityLabel={t('collection.filters')}
            />
          }
        />
      }
    >
      <View className="border-b border-border bg-surface">
        <FlatList
          data={SORT_KEYS}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            gap: 8,
          }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setSort(item)
                track('sort_changed', { sort: item })
              }}
              className={`px-4 py-2 rounded-full border ${
                sort === item ? 'bg-primary border-primary' : 'bg-surface border-border'
              }`}
            >
              <Typography variant="body-sm" color={sort === item ? 'surface' : 'muted'}>
                {t(`collection.sort.${item}`)}
              </Typography>
            </Pressable>
          )}
        />
      </View>
      <ProductGrid
        variant="featured"
        products={result}
        isPending={isPending}
        isError={isError}
        refetch={refetch}
        onProductPress={(p) => router.push(`/product/${p.id}`)}
      />
      <FiltersSheet value={filters} onChange={setFilters} sheetRef={filtersRef} />
    </ScreenWrapper>
  )
}
