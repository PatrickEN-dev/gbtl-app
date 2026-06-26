// src/components/product/ProductCard/index.tsx
import Badge from "@/components/ui/Badge";
import Typography from "@/components/ui/Typography";
import { Colors } from "@/constants/tokens";
import { useWishlist } from "@/hooks/useWishlist";
import { useCartBounce, useFadeInUp, usePressScale } from "@/lib/animations";
import type { Product } from "@/types";
import { Image } from "expo-image";
import { Heart } from "lucide-react-native";
import React, { createContext, useContext } from "react";
import { Pressable, View } from "react-native";
import Animated from "react-native-reanimated";

// ─── Context ─────────────────────────────────────────────────────────────────

interface ProductCardContextValue {
  product: Product;
}

const ProductCardContext = createContext<ProductCardContextValue | null>(null);

function useProductCardContext() {
  const ctx = useContext(ProductCardContext);
  if (!ctx) throw new Error("Must be used inside ProductCard.Root");
  return ctx;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

interface RootProps {
  product: Product;
  onPress?: () => void;
  staggerIndex?: number;
  children: React.ReactNode;
}

function Root({ product, onPress, staggerIndex = 0, children }: RootProps) {
  const { animatedStyle: fadeStyle } = useFadeInUp(staggerIndex * 80);
  const { animatedStyle: pressStyle, handlePressIn, handlePressOut } = usePressScale(0.97);

  return (
    <ProductCardContext.Provider value={{ product }}>
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View
          className="bg-surface rounded-card overflow-hidden"
          style={[
            fadeStyle,
            pressStyle,
            {
              shadowColor: Colors.primary,
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
  );
}

// ─── Image ────────────────────────────────────────────────────────────────────

function CardImage() {
  const { product } = useProductCardContext();
  return (
    <View className="relative">
      <Image
        source={{ uri: product.images[0] }}
        contentFit="cover"
        style={{ width: "100%", aspectRatio: 3 / 4, borderRadius: 0 }}
      />
      <View className="absolute top-2 left-2 gap-1">
        {product.isNew && <NewBadge />}
        {product.isSale && <SaleBadge />}
      </View>
    </View>
  );
}

// ─── Body ─────────────────────────────────────────────────────────────────────

interface BodyProps {
  children: React.ReactNode;
}

function Body({ children }: BodyProps) {
  return <View className="px-3 pt-2 pb-1">{children}</View>;
}

// ─── Name ─────────────────────────────────────────────────────────────────────

function Name() {
  const { product } = useProductCardContext();
  return (
    <Typography variant="body-sm" color="primary" numberOfLines={2}>
      {product.name}
    </Typography>
  );
}

// ─── Price ────────────────────────────────────────────────────────────────────

function Price() {
  const { product } = useProductCardContext();
  const hasSale = product.isSale && product.originalPrice != null;

  if (hasSale) {
    return (
      <View className="flex-row items-center gap-2 mt-0.5">
        <Typography variant="price" color="accent">
          ${product.price.toFixed(2)}
        </Typography>
        <Typography variant="body-sm" color="muted" style={{ textDecorationLine: "line-through" }}>
          ${product.originalPrice!.toFixed(2)}
        </Typography>
      </View>
    );
  }

  return (
    <View className="mt-0.5">
      <Typography variant="price" color="primary">
        ${product.price.toFixed(2)}
      </Typography>
    </View>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

interface FooterProps {
  children: React.ReactNode;
}

function Footer({ children }: FooterProps) {
  return <View className="flex-row items-center justify-end px-3 pb-3">{children}</View>;
}

// ─── WishlistButton ───────────────────────────────────────────────────────────

function WishlistButton() {
  const { product } = useProductCardContext();
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const { animatedStyle, trigger } = useCartBounce();

  function handlePress() {
    trigger();
    toggle(product.id);
  }

  return (
    <Pressable onPress={handlePress} hitSlop={8}>
      <Animated.View style={animatedStyle}>
        <Heart
          size={20}
          color={wishlisted ? Colors.accent : Colors.muted}
          fill={wishlisted ? Colors.accent : "transparent"}
        />
      </Animated.View>
    </Pressable>
  );
}

// ─── NewBadge ─────────────────────────────────────────────────────────────────

function NewBadge() {
  const { product } = useProductCardContext();
  if (!product.isNew) return null;
  return (
    <Badge variant="accent" size="sm">
      NEW
    </Badge>
  );
}

// ─── SaleBadge ────────────────────────────────────────────────────────────────

function SaleBadge() {
  const { product } = useProductCardContext();
  if (!product.isSale) return null;
  return (
    <Badge variant="error" size="sm">
      SALE
    </Badge>
  );
}

// ─── Export namespace ─────────────────────────────────────────────────────────

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
};
