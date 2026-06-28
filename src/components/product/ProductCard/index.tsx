import Badge from '@/components/ui/Badge'
import Typography from '@/components/ui/Typography'
import { useThemeColors } from '@/hooks/useThemeColors'
import { useWishlist } from '@/hooks/useWishlist'
import { useCartBounce, useFadeInUp, usePressScale } from '@/lib/animations'
import { formatCurrency } from '@/lib/format'
import type { Product } from '@/types'
import { Image } from 'expo-image'
import { Heart } from 'lucide-react-native'
import React, { createContext, useContext } from 'react'
import { Pressable, View } from 'react-native'
import Animated from 'react-native-reanimated'

interface ProductCardContextValue {
  product: Product
}

const ProductCardContext = createContext<ProductCardContextValue | null>(null)

function useProductCardContext() {
  const ctx = useContext(ProductCardContext)
  if (!ctx) throw new Error('Must be used inside ProductCard.Root')
  return ctx
}

interface RootProps {
  product: Product
  onPress?: () => void
  staggerIndex?: number
  children: React.ReactNode
}

function Root({ product, onPress, staggerIndex = 0, children }: RootProps) {
  const { animatedStyle: fadeStyle } = useFadeInUp(staggerIndex * 80)
  const { animatedStyle: pressStyle, handlePressIn, handlePressOut } = usePressScale(0.97)
  const colors = useThemeColors()

  return (
    <ProductCardContext.Provider value={{ product }}>
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View
          className="bg-surface rounded-card overflow-hidden"
          style={[
            fadeStyle,
            pressStyle,
            {
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            },
          ]}
        >
          {children}
        </Animated.View>
      </Pressable>
    </ProductCardContext.Provider>
  )
}

interface WishlistChipProps {
  productId: string
}

function WishlistChip({ productId }: WishlistChipProps) {
  const { toggle, isWishlisted } = useWishlist()
  const wishlisted = isWishlisted(productId)
  const { animatedStyle, trigger } = useCartBounce()
  const colors = useThemeColors()

  function handlePress() {
    trigger()
    toggle(productId)
  }

  return (
    <View
      className="absolute top-2 right-2 w-8 h-8 bg-surface rounded-full items-center justify-center"
      style={{
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <Pressable onPress={handlePress} hitSlop={8}>
        <Animated.View style={animatedStyle}>
          <Heart
            size={16}
            color={wishlisted ? colors.accent : colors.muted}
            fill={wishlisted ? colors.accent : 'transparent'}
          />
        </Animated.View>
      </Pressable>
    </View>
  )
}

function CardImage() {
  const { product } = useProductCardContext()
  return (
    <View className="relative">
      <Image
        source={{ uri: product.images[0] }}
        contentFit="cover"
        style={{ width: '100%', aspectRatio: 4 / 5, borderRadius: 0 }}
      />
      <View className="absolute top-2 left-2 gap-1">
        {product.isNew && <NewBadge />}
        {product.isSale && <SaleBadge />}
      </View>
      <WishlistChip productId={product.id} />
    </View>
  )
}

interface BodyProps {
  children: React.ReactNode
}

function Body({ children }: BodyProps) {
  return <View className="px-3 pt-2 pb-1">{children}</View>
}

function Name() {
  const { product } = useProductCardContext()
  return (
    <Typography variant="body-sm" color="primary" numberOfLines={2}>
      {product.name}
    </Typography>
  )
}

function Price() {
  const { product } = useProductCardContext()
  const hasSale = product.isSale && product.originalPrice != null

  if (hasSale) {
    return (
      <View className="flex-row items-center gap-2 mt-0.5">
        <Typography variant="price" color="accent">
          {formatCurrency(product.price)}
        </Typography>
        <Typography
          variant="body-sm"
          color="muted"
          style={{ textDecorationLine: 'line-through' }}
        >
          {formatCurrency(product.originalPrice!)}
        </Typography>
      </View>
    )
  }

  return (
    <View className="mt-0.5">
      <Typography variant="price" color="primary">
        {formatCurrency(product.price)}
      </Typography>
    </View>
  )
}

interface FooterProps {
  children: React.ReactNode
}

function Footer({ children }: FooterProps) {
  return <View className="flex-row items-center justify-end px-3 pb-3">{children}</View>
}

function WishlistButton() {
  const { product } = useProductCardContext()
  const { toggle, isWishlisted } = useWishlist()
  const wishlisted = isWishlisted(product.id)
  const { animatedStyle, trigger } = useCartBounce()
  const colors = useThemeColors()

  function handlePress() {
    trigger()
    toggle(product.id)
  }

  return (
    <Pressable onPress={handlePress} hitSlop={8}>
      <Animated.View style={animatedStyle}>
        <Heart
          size={20}
          color={wishlisted ? colors.accent : colors.muted}
          fill={wishlisted ? colors.accent : 'transparent'}
        />
      </Animated.View>
    </Pressable>
  )
}

function NewBadge() {
  const { product } = useProductCardContext()
  if (!product.isNew) return null
  return (
    <Badge variant="accent" size="sm">
      NEW
    </Badge>
  )
}

function SaleBadge() {
  const { product } = useProductCardContext()
  if (!product.isSale) return null
  return (
    <Badge variant="error" size="sm">
      SALE
    </Badge>
  )
}

function FeaturedLayout() {
  const { product } = useProductCardContext()
  return (
    <>
      <CardImage />

      <View className="flex-row items-end justify-between px-4 py-3">
        <Typography variant="heading3" className="flex-1 mr-3" numberOfLines={2}>
          {product.name}
        </Typography>
        <View className="items-end">
          <Typography variant="caption" color="muted">
            Preço
          </Typography>
          <Typography variant="price">{formatCurrency(product.price)}</Typography>
        </View>
      </View>
    </>
  )
}

export const ProductCard = {
  Root,
  Image: CardImage,
  Body,
  Name,
  Price,
  Footer,
  WishlistButton,
  NewBadge,
  SaleBadge,
  FeaturedLayout,
}
