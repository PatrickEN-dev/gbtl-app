// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react'
import { View, FlatList, Pressable } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { ShoppingBag } from 'lucide-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Typography from '@/components/ui/Typography'
import Badge from '@/components/ui/Badge'
import SearchBar from '@/components/ui/SearchBar'
import ProductGrid from '@/components/product/ProductGrid'
import { usePressScale, Duration } from '@/lib/animations'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useProducts } from '@/hooks/useProducts'
import { Colors } from '@/constants/tokens'

const CATEGORIES = ['Trending', 'Shows', 'Bag', 'Shirts'] as const
const CATEGORY_API: Record<string, string | undefined> = {
  Trending: undefined, Shows: 'women', Bag: 'men', Shirts: 'kids',
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase()
}

// ─── CategoryChip ─────────────────────────────────────────────────────────────

interface ChipProps { label: string; isActive: boolean; onPress: () => void }
function CategoryChip({ label, isActive, onPress }: ChipProps) {
  const press = usePressScale(0.95)
  const progress = useSharedValue(isActive ? 1 : 0)
  useEffect(() => {
    progress.value = withTiming(isActive ? 1 : 0, { duration: Duration.fast })
  }, [isActive, progress])
  const chipStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [Colors.surface, Colors.primary]),
  }))
  return (
    <Pressable onPress={onPress} onPressIn={press.handlePressIn} onPressOut={press.handlePressOut} className="mr-2">
      <Animated.View style={[chipStyle, press.animatedStyle]} className="px-4 py-2 rounded-full border border-border">
        <Typography variant="body-sm" color={isActive ? 'white' : 'muted'}>{label}</Typography>
      </Animated.View>
    </Pressable>
  )
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { totalItems } = useCart()
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Trending')
  const cartPress = usePressScale(0.9)
  const firstName = user?.name?.split(' ')[0] ?? 'there'
  const { data, isPending, isError, refetch } = useProducts(CATEGORY_API[activeCategory])

  return (
    <View className="flex-1 bg-bg">
      {/* Top row: avatar left | GBTL centered | cart icon right */}
      <View
        className="px-5 mb-4 flex-row items-center"
        style={{ marginTop: insets.top + 8 }}
      >
        {/* Left — avatar */}
        <Pressable
          className="bg-surface rounded-full overflow-hidden border border-border"
          style={{ width: 36, height: 36 }}
          onPress={() => router.push('/(tabs)/profile')}
        >
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={{ width: 36, height: 36 }} contentFit="cover" />
          ) : (
            <View className="bg-primary w-full h-full items-center justify-center">
              <Typography variant="body-sm" weight="bold" color="white">
                {getInitials(user?.name ?? 'GB')}
              </Typography>
            </View>
          )}
        </Pressable>

        {/* Middle — brand centered */}
        <View className="flex-1 items-center">
          <Typography variant="heading3" weight="bold">GBTL</Typography>
        </View>

        {/* Right — bare cart icon with badge */}
        <Animated.View style={cartPress.animatedStyle}>
          <Pressable
            onPress={() => router.push('/(tabs)/cart')}
            onPressIn={cartPress.handlePressIn}
            onPressOut={cartPress.handlePressOut}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}
          >
            <ShoppingBag size={22} color={Colors.primary} />
            {totalItems > 0 && (
              <View className="absolute -top-1 -right-1">
                <Badge variant="accent" size="sm">{totalItems}</Badge>
              </View>
            )}
          </Pressable>
        </Animated.View>
      </View>

      {/* Greeting */}
      <View className="px-5 mb-1">
        <Typography variant="heading1">Hello {firstName}</Typography>
        <Typography variant="body-sm" color="muted">Fashion confidence and reveals beauty.</Typography>
      </View>

      {/* SearchBar */}
      <View className="px-5 mt-4 mb-4">
        <SearchBar value={query} onChangeText={setQuery} />
      </View>

      {/* Category pills */}
      <View className="px-5 mb-2">
        <FlatList
          data={CATEGORIES}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryChip label={item} isActive={activeCategory === item} onPress={() => setActiveCategory(item)} />
          )}
        />
      </View>

      {/* Product grid */}
      <View className="flex-1">
        <ProductGrid
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
