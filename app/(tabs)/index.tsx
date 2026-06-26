// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react'
import { View, FlatList, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated'
import type { SharedValue } from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { ShoppingBag } from 'lucide-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ScreenWrapper from '@/components/layout/ScreenWrapper'
import Typography from '@/components/ui/Typography'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import ProductGrid from '@/components/product/ProductGrid'
import { useParallax, usePressScale, Duration } from '@/lib/animations'
import { useCart } from '@/hooks/useCart'
import { useProducts } from '@/hooks/useProducts'
import { Colors } from '@/constants/tokens'

const CATEGORIES = ['All', 'Men', 'Women', 'Kids'] as const
const HERO_URI = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800'

// ─── CategoryChip ─────────────────────────────────────────────────────────────

interface ChipProps { label: string; isActive: boolean; onPress: () => void }
function CategoryChip({ label, isActive, onPress }: ChipProps) {
  const press = usePressScale(0.95)
  const progress = useSharedValue(isActive ? 1 : 0)
  useEffect(() => {
    progress.value = withTiming(isActive ? 1 : 0, { duration: Duration.fast })
  }, [isActive])
  const chipStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [Colors.surface, Colors.accent]),
  }))
  return (
    <Pressable onPress={onPress} onPressIn={press.handlePressIn}
      onPressOut={press.handlePressOut} className="mr-2">
      <Animated.View style={[chipStyle, press.animatedStyle]}
        className="px-4 py-2 rounded-full border border-border">
        <Typography variant="body-sm" color={isActive ? 'white' : 'muted'}>
          {label}
        </Typography>
      </Animated.View>
    </Pressable>
  )
}

// ─── HomeContent ──────────────────────────────────────────────────────────────

interface ContentProps {
  scrollY: SharedValue<number>
  activeCategory: string
  onCategoryChange: (c: string) => void
}
function HomeContent({ scrollY, activeCategory, onCategoryChange }: ContentProps) {
  const router = useRouter()
  const { animatedStyle: heroStyle } = useParallax(scrollY, 0.3)
  const catParam = activeCategory === 'All' ? undefined : activeCategory.toLowerCase()
  const { data, isPending, isError, refetch } = useProducts(catParam)
  return (
    <>
      <View style={{ aspectRatio: 3 / 4 }} className="w-full overflow-hidden">
        <Animated.View
          style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }, heroStyle]}>
          <Image source={{ uri: HERO_URI }} className="w-full h-full" contentFit="cover" />
        </Animated.View>
        <View className="absolute inset-0 bg-black/60 justify-end p-6">
          <Typography variant="heading1" color="white">New Arrivals</Typography>
          <View className="mt-3">
            <Button variant="primary" size="sm"
              onPress={() => router.push('/(tabs)/collection')}>
              Shop Now
            </Button>
          </View>
        </View>
      </View>
      <View className="px-4 py-3">
        <FlatList
          data={[...CATEGORIES]}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryChip label={item} isActive={activeCategory === item}
              onPress={() => onCategoryChange(item)} />
          )}
        />
      </View>
      <ProductGrid
        products={data ?? []}
        isPending={isPending}
        isError={isError}
        refetch={refetch}
        onProductPress={(p) => router.push(`/product/${p.id}`)}
      />
    </>
  )
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { totalItems } = useCart()
  const [activeCategory, setActiveCategory] = useState('All')
  const cartPress = usePressScale(0.9)
  return (
    <View className="flex-1">
      <ScreenWrapper scrollable>
        {({ scrollY }) => (
          <HomeContent scrollY={scrollY} activeCategory={activeCategory}
            onCategoryChange={setActiveCategory} />
        )}
      </ScreenWrapper>
      <View
        className="absolute left-0 right-0 z-50 flex-row items-center justify-between px-5"
        style={{ top: insets.top + 8 }}
      >
        <Typography variant="heading2" color="white">GBTL</Typography>
        <Animated.View style={cartPress.animatedStyle}>
          <Pressable
            onPress={() => router.push('/(tabs)/cart')}
            onPressIn={cartPress.handlePressIn}
            onPressOut={cartPress.handlePressOut}
          >
            <View className="relative">
              <ShoppingBag size={24} color={Colors.surface} />
              {totalItems > 0 && (
                <View className="absolute -top-1 -right-2">
                  <Badge variant="accent" size="sm">{totalItems}</Badge>
                </View>
              )}
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  )
}
