import React, { useState } from 'react'
import { View, FlatList } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeIn } from 'react-native-reanimated'
import { ShoppingBag, Heart, Settings as SettingsIcon } from 'lucide-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Typography from '@/components/ui/Typography'
import SearchBar from '@/components/ui/SearchBar'
import ProductGrid from '@/components/product/ProductGrid'
import Pill from '@/components/primitives/Pill'
import IconButton from '@/components/primitives/IconButton'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { useThemeColors } from '@/hooks/useThemeColors'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useProducts } from '@/hooks/useProducts'
import { useCartUI } from '@/store/cartUIStore'
import { useTranslation } from '@/lib/i18n'

type CategoryKey = 'trending' | 'men' | 'women' | 'kids'
const CATEGORIES: CategoryKey[] = ['trending', 'men', 'women', 'kids']
const CATEGORY_API: Record<CategoryKey, string | undefined> = {
  trending: undefined,
  men: 'men',
  women: 'women',
  kids: 'kids',
}

export default function HomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { totalItems } = useCart()
  const { user } = useAuth()
  const { t } = useTranslation()
  const colors = useThemeColors()
  const openCart = useCartUI((s) => s.open)
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('trending')
  const [search, setSearch] = useState('')
  const firstName = user?.name?.split(' ')[0] ?? t('home.guest')
  const { data, isPending, isError, refetch } = useProducts(CATEGORY_API[activeCategory])

  const filtered =
    search.trim().length === 0
      ? data
      : data?.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()))

  return (
    <View className="flex-1 bg-bg">
      <Animated.View
        entering={FadeIn.duration(560)}
        className="px-5 flex-row items-center"
        style={{ marginTop: insets.top + 8, marginBottom: 12 }}
      >
        <ThemeToggle />
        <IconButton
          icon={<SettingsIcon size={20} color={colors.primary} />}
          variant="ghost"
          size="md"
          onPress={() => router.push('/settings')}
          accessibilityLabel={t('a11y.openSettings')}
        />
        <IconButton
          icon={<Heart size={20} color={colors.primary} />}
          variant="ghost"
          size="md"
          onPress={() => router.push('/wishlist')}
          accessibilityLabel={t('a11y.openWishlist')}
        />

        <View className="flex-1 items-center">
          <Typography variant="heading3" weight="bold" style={{ letterSpacing: 4 }}>
            GBTL
          </Typography>
        </View>

        <IconButton
          icon={<ShoppingBag size={20} color={colors.primary} />}
          variant="ghost"
          size="md"
          badge={totalItems > 0 ? totalItems : undefined}
          onPress={openCart}
          accessibilityLabel={t('a11y.openCart')}
        />
      </Animated.View>

      <View className="px-5 mb-1">
        <Typography variant="heading1">
          {t('home.greeting', { name: firstName })}
        </Typography>
        <Typography variant="body-sm" color="muted" className="mt-1">
          {t('home.tagline')}
        </Typography>
      </View>

      <View className="px-5 mt-4">
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder={t('home.searchPlaceholder') as string}
        />
      </View>

      <View className="px-5 mt-4 mb-1">
        <FlatList
          data={CATEGORIES}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="mr-2">
              <Pill
                variant={activeCategory === item ? 'solid' : 'ghost'}
                tone="primary"
                size="md"
                onPress={() => setActiveCategory(item)}
              >
                {t(`home.categories.${item}`)}
              </Pill>
            </View>
          )}
        />
      </View>

      <View className="flex-1">
        <ProductGrid
          variant="featured"
          products={filtered ?? []}
          isPending={isPending}
          isError={isError}
          refetch={refetch}
          onProductPress={(p) => router.push(`/product/${p.id}`)}
        />
      </View>
    </View>
  )
}
