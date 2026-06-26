// app/product/[id].tsx
import React, { useState, useEffect } from 'react'
import { ScrollView, View, Pressable } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, withSequence } from 'react-native-reanimated'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Heart, ShoppingCart, AlertCircle } from 'lucide-react-native'
import { useProduct } from '@/hooks/useProduct'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { usePressScale, useCartBounce, Spring, Duration } from '@/lib/animations'
import { ProductDetailSkeleton } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import Header from '@/components/layout/Header'
import Typography from '@/components/ui/Typography'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { ImageCarousel } from '@/components/product/ImageCarousel'
import ColorSwatch from '@/components/product/ColorSwatch'
import SizeSelector from '@/components/product/SizeSelector'
import { Colors } from '@/constants/tokens'
import type { ProductColor } from '@/types'

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { data: product, isPending, isError, refetch } = useProduct(id)
  const { addItem } = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [expanded, setExpanded] = useState(false)
  const descHeight = useSharedValue(72)
  const descStyle = useAnimatedStyle(() => ({ maxHeight: descHeight.value, overflow: 'hidden' }))
  const heartScale = useSharedValue(1)
  const heartStyle = useAnimatedStyle(() => ({ transform: [{ scale: heartScale.value }] }))
  const { animatedStyle: pressStyle } = usePressScale(0.95)
  const { trigger } = useCartBounce()

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
    trigger()
    addItem(product, selectedSize, selectedColor)
    router.push('/(tabs)/cart')
  }

  if (isPending) return <ProductDetailSkeleton />
  if (isError || !product) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Something went wrong"
        action={{ label: 'Try again', onPress: refetch }}
      />
    )
  }

  const wishlisted = isWishlisted(product.id)
  const wishlistHeart = (
    <Animated.View style={heartStyle}>
      <Pressable onPress={handleToggleWishlist} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Heart size={22} color={wishlisted ? Colors.accent : Colors.muted} fill={wishlisted ? Colors.accent : 'transparent'} />
      </Pressable>
    </Animated.View>
  )

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <Header showBack transparent rightElement={wishlistHeart} />
        <ImageCarousel.Root images={product.images}>
          <ImageCarousel.Slide />
          <ImageCarousel.Thumbnails />
          <ImageCarousel.Dots />
        </ImageCarousel.Root>
        <View className="px-4 pt-4 pb-32">
          <View className="flex-row items-start justify-between mb-2">
            <Typography variant="heading1" className="flex-1 mr-2">{product.name}</Typography>
            <Badge variant="accent">{product.rating.toFixed(1)}</Badge>
          </View>
          <View className="flex-row items-center gap-2 mb-4">
            <Typography variant="price" color={product.isSale ? 'accent' : 'primary'}>
              ${product.price}
            </Typography>
            {product.isSale && product.originalPrice != null && (
              <Typography variant="body" color="muted" className="line-through">
                ${product.originalPrice}
              </Typography>
            )}
          </View>
          <Typography variant="body-sm" color="muted" className="mb-2">Color</Typography>
          {selectedColor && (
            <ColorSwatch colors={product.colors} selected={selectedColor} onSelect={setSelectedColor} />
          )}
          <Typography variant="body-sm" color="muted" className="mt-4 mb-2">Size</Typography>
          <SizeSelector sizes={product.sizes} selected={selectedSize} onSelect={setSelectedSize} />
          <Typography variant="body-sm" color="muted" className="mt-4 mb-2">Description</Typography>
          <Animated.View style={descStyle}>
            <Typography variant="body">{product.description}</Typography>
          </Animated.View>
          <Pressable onPress={handleToggleDesc} className="mt-2">
            <Typography variant="body-sm" color="accent">
              {expanded ? 'Read less' : 'Read more'}
            </Typography>
          </Pressable>
        </View>
      </ScrollView>
      <Animated.View
        style={[pressStyle, { paddingBottom: insets.bottom + 16 }]}
        className="absolute bottom-0 left-0 right-0 bg-surface px-4 pt-4"
      >
        <Button
          variant="primary"
          fullWidth
          leftIcon={<ShoppingCart size={18} color={Colors.surface} />}
          onPress={handleAddToCart}
        >
          Add to Cart
        </Button>
      </Animated.View>
    </View>
  )
}
