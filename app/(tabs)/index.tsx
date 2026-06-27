// app/(tabs)/index.tsx
import React, { useState } from 'react'
import { View, FlatList } from 'react-native'
import { useRouter } from 'expo-router'
import { ShoppingBag, Plus, Heart } from 'lucide-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Typography from '@/components/ui/Typography'
import ProductGrid from '@/components/product/ProductGrid'
import Pill from '@/components/primitives/Pill'
import IconButton from '@/components/primitives/IconButton'
import { useThemeColors } from '@/hooks/useThemeColors'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useProducts } from '@/hooks/useProducts'
import { useTranslation } from '@/lib/i18n'

const CATEGORIES = ['Trending', 'Men', 'Women', 'Kids'] as const
const CATEGORY_API: Record<string, string | undefined> = {
  Trending: undefined,
  Men: 'men',
  Women: 'women',
  Kids: 'kids',
}

export default function HomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { totalItems } = useCart()
  const { user } = useAuth()
  const { t } = useTranslation()
  const colors = useThemeColors()
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>('Trending')
  const firstName = user?.name?.split(' ')[0] ?? t('home.guest')
  const { data, isPending, isError, refetch } = useProducts(CATEGORY_API[activeCategory])

  return (
    <View className="flex-1 bg-bg">
      {/* Top row: wishlist | brand mark | cart */}
      <View
        className="px-5 mb-4 flex-row items-center"
        style={{ marginTop: insets.top + 8 }}
      >
        <IconButton
          icon={<Heart size={20} color={colors.primary} />}
          variant="ghost"
          size="md"
          onPress={() => router.push('/wishlist')}
          accessibilityLabel={t('a11y.openWishlist')}
        />

        <View className="flex-1 items-center">
          <Plus size={28} color={colors.primary} strokeWidth={2.5} />
        </View>

        <IconButton
          icon={<ShoppingBag size={20} color={colors.primary} />}
          variant="ghost"
          size="md"
          badge={totalItems > 0 ? totalItems : undefined}
          onPress={() => router.push('/(tabs)/cart')}
          accessibilityLabel={t('a11y.openCart')}
        />
      </View>

      {/* Greeting */}
      <View className="px-5 mb-1">
        <Typography variant="heading1">{t('home.greeting', { name: firstName })}</Typography>
        <Typography variant="body-sm" color="muted">{t('home.tagline')}</Typography>
      </View>

      {/* Category pills */}
      <View className="px-5 mt-4 mb-2">
        <FlatList
          data={[...CATEGORIES]}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="mr-2">
              <Pill
                variant={activeCategory === item ? 'solid' : 'ghost'}
                tone="primary"
                size="sm"
                onPress={() => setActiveCategory(item)}
              >
                {item}
              </Pill>
            </View>
          )}
        />
      </View>

      {/* Product grid — featured 1-column layout */}
      <View className="flex-1">
        <ProductGrid
          variant="featured"
          products={data ?? []}
          isPending={isPending}
          isError={isError}
          refetch={refetch}
          onProductPress={(p) => router.push(`/product/${p.id}`)}
        />
      </View>
    </View>
  )
}
