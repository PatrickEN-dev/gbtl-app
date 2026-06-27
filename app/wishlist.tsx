
import React from 'react'
import { View } from 'react-native'
import { useRouter } from 'expo-router'
import { Heart } from 'lucide-react-native'
import ScreenWrapper from '@/components/layout/ScreenWrapper'
import Header from '@/components/layout/Header'
import EmptyState from '@/components/ui/EmptyState'
import ProductGrid from '@/components/product/ProductGrid'
import { useWishlist } from '@/hooks/useWishlist'
import { useWishlistStore } from '@/store/wishlistStore'
import { useProducts } from '@/hooks/useProducts'
import { useTranslation } from '@/lib/i18n'

export default function WishlistScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const { data: allProducts, isPending, isError, refetch } = useProducts()
  const ids = useWishlistStore((s) => s.ids)
  const products = (allProducts ?? []).filter((p) => ids.includes(p.id))

  return (
    <ScreenWrapper header={<Header showBack roundedIcons title={t('wishlist.title')} />}>
      {!isPending && products.length === 0 ? (
        <EmptyState
          icon={Heart}
          title={t('wishlist.empty')}
          description={t('wishlist.emptyDescription')}
          action={{
            label: t('wishlist.browseCollection'),
            onPress: () => router.replace('/(tabs)/collection'),
          }}
        />
      ) : (
        <View className="flex-1">
          <ProductGrid
            variant="featured"
            products={products}
            isPending={isPending}
            isError={isError}
            refetch={refetch}
            onProductPress={(p) => router.push(`/product/${p.id}`)}
          />
        </View>
      )}
    </ScreenWrapper>
  )
}
