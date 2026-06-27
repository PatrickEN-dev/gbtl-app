
import React, { useState, useEffect } from 'react'
import { ScrollView, View, Pressable } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, withSequence } from 'react-native-reanimated'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Heart, AlertCircle } from 'lucide-react-native'
import { useProduct } from '@/hooks/useProduct'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { useCartBounce, Spring, Duration } from '@/lib/animations'
import { useThemeColors } from '@/hooks/useThemeColors'
import { ProductDetailSkeleton } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import Header from '@/components/layout/Header'
import Typography from '@/components/ui/Typography'
import Button from '@/components/ui/Button'
import { ImageCarousel } from '@/components/product/ImageCarousel'
import ColorSwatch from '@/components/product/ColorSwatch'
import SizeSelector from '@/components/product/SizeSelector'
import QuantityStepper from '@/components/ui/QuantityStepper'
import type { ProductColor } from '@/types'

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { data: product, isPending, isError, refetch } = useProduct(id)
  const { addItem } = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const { trigger } = useCartBounce()
  const colors = useThemeColors()
  const [qty, setQty] = useState(1)
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [expanded, setExpanded] = useState(false)
  const descHeight = useSharedValue(72)
  const descStyle = useAnimatedStyle(() => ({ maxHeight: descHeight.value, overflow: 'hidden' }))
  const heartScale = useSharedValue(1)
  const heartStyle = useAnimatedStyle(() => ({ transform: [{ scale: heartScale.value }] }))

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0] ?? null)
      setSelectedSize(product.sizes.find((s) => s.available)?.label ?? product.sizes[0]?.label ?? '')
    }
  }, [product])

  const handleToggleDesc = () => {
    descHeight.value = withTiming(expanded ? 72 : 300, { duration: Duration.slow })
    setExpanded(!expanded)
  }
  const handleToggleWishlist = () => {
    if (!product) return
    heartScale.value = withSequence(withSpring(1.3, Spring.snappy), withSpring(1, Spring.gentle))
    toggle(product.id)
  }
  const handleAddToCart = () => {
    if (!product || !selectedColor) return
    for (let i = 0; i < qty; i++) addItem(product, selectedSize, selectedColor)
    trigger()
  }
  const handleBuyNow = () => { handleAddToCart(); router.push('/(tabs)/cart') }

  if (isPending) return <ProductDetailSkeleton />
  if (isError || !product) return <EmptyState icon={AlertCircle} title="Something went wrong" action={{ label: 'Try again', onPress: refetch }} />

  const wishlisted = isWishlisted(product.id)
  const wishlistHeart = (
    <Animated.View style={heartStyle}>
      <Pressable onPress={handleToggleWishlist} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Heart size={18} color={wishlisted ? colors.accent : colors.muted} fill={wishlisted ? colors.accent : 'transparent'} />
      </Pressable>
    </Animated.View>
  )

  return (
    <View className="flex-1 bg-bg">
      <Header showBack roundedIcons title="Details" rightElement={wishlistHeart} />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1" contentContainerStyle={{ paddingBottom: 140 }}>

        <View className="px-4 pt-2">
          <ImageCarousel.Root images={product.images}>
            <View className="flex-row">
              <View className="flex-1"><ImageCarousel.Slide aspectRatio={1} /></View>
              <ImageCarousel.SideThumbnails />
            </View>
          </ImageCarousel.Root>
        </View>


        <View className="px-4 mt-6">
          <View className="flex-row items-center">
            <Typography variant="heading2" className="flex-1 mr-3">{product.name}</Typography>
            <QuantityStepper value={qty} onChange={setQty} />
          </View>
          <View className="flex-row items-center justify-between mt-4">
            <View className="flex-row items-baseline gap-1.5">
              <Typography variant="body-sm" color="muted">From:</Typography>
              <Typography variant="price">${product.price}</Typography>
            </View>
            {selectedColor && (
              <ColorSwatch colors={product.colors} selected={selectedColor} onSelect={setSelectedColor} hideLabel />
            )}
          </View>
        </View>


        <View className="px-4 mt-6">
          <Typography variant="heading3" className="mb-3">Select Size</Typography>
          <SizeSelector sizes={product.sizes} selected={selectedSize} onSelect={setSelectedSize} />
        </View>


        <View className="px-4 mt-6">
          <Typography variant="heading3" className="mb-2">Description</Typography>
          <Animated.View style={descStyle}>
            <Typography variant="body" color="muted">{product.description}</Typography>
          </Animated.View>
          <Pressable onPress={handleToggleDesc} className="mt-2">
            <Typography variant="body-sm" color="accent">{expanded ? 'Read less' : 'Read more'}</Typography>
          </Pressable>
        </View>
      </ScrollView>


      <View
        className="absolute bottom-0 left-0 right-0 bg-surface px-4 pt-3 border-t border-border"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        <View className="flex-row gap-3">
          <View className="flex-1"><Button variant="outline" fullWidth rounded="pill" onPress={handleAddToCart}>Add to Cart</Button></View>
          <View className="flex-1"><Button variant="primary" fullWidth rounded="pill" onPress={handleBuyNow}>Buy Now</Button></View>
        </View>
      </View>
    </View>
  )
}
