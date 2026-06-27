
import React, { useState } from 'react'
import { View, FlatList, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import ScreenWrapper from '@/components/layout/ScreenWrapper'
import Header from '@/components/layout/Header'
import Typography from '@/components/ui/Typography'
import ProductGrid from '@/components/product/ProductGrid'
import { useProducts } from '@/hooks/useProducts'
import type { Product } from '@/types'

const SORT_OPTIONS = ['Relevance', 'Price ↑', 'Price ↓', 'Newest'] as const
type SortOption = (typeof SORT_OPTIONS)[number]

function sortProducts(products: Product[], sort: SortOption): Product[] {
  switch (sort) {
    case 'Price ↑':
      return [...products].sort((a, b) => a.price - b.price)
    case 'Price ↓':
      return [...products].sort((a, b) => b.price - a.price)
    case 'Newest':
      return [...products].reverse()
    default:
      return products
  }
}

export default function CollectionScreen() {
  const router = useRouter()
  const [sort, setSort] = useState<SortOption>('Relevance')
  const { data, isPending, isError, refetch } = useProducts()
  const sorted = data ? sortProducts(data, sort) : []

  return (
    <ScreenWrapper header={<Header title="Collection" showCart />}>
      <View className="border-b border-border bg-surface">
        <FlatList
          data={[...SORT_OPTIONS]}
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
              onPress={() => setSort(item)}
              className={`px-4 py-2 rounded-full border ${
                sort === item
                  ? 'bg-primary border-primary'
                  : 'bg-surface border-border'
              }`}
            >
              <Typography
                variant="body-sm"
                color={sort === item ? 'white' : 'muted'}
              >
                {item}
              </Typography>
            </Pressable>
          )}
        />
      </View>
      <ProductGrid
        variant="featured"
        products={sorted}
        isPending={isPending}
        isError={isError}
        refetch={refetch}
        onProductPress={(p) => router.push(`/product/${p.id}`)}
      />
    </ScreenWrapper>
  )
}
