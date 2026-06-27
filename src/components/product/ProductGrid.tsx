// src/components/product/ProductGrid.tsx
import { ProductCard } from "@/components/product/ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { Spacing } from "@/constants/tokens";
import type { Product } from "@/types";
import { AlertCircle, Package } from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import Animated from "react-native-reanimated";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

interface ProductGridProps {
  products?: Product[];
  isPending: boolean;
  isError: boolean;
  refetch: () => unknown;
  onProductPress?: (product: Product) => void;
  listHeader?: React.ReactElement | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollHandler?: (event: any) => void;
  variant?: "grid" | "featured"; // default 'grid'
}

function SkeletonGrid() {
  const rows = [0, 1, 2];
  return (
    <View className="px-4 pt-4" style={{ gap: Spacing.sm }}>
      {rows.map((row) => (
        <View key={row} style={{ flexDirection: "row", gap: Spacing.sm }}>
          <View style={{ flex: 1 }}>
            <ProductCardSkeleton />
          </View>
          <View style={{ flex: 1 }}>
            <ProductCardSkeleton />
          </View>
        </View>
      ))}
    </View>
  );
}

function ErrorState({ refetch }: { refetch: () => unknown }) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="Something went wrong"
      description="Failed to load products. Please try again."
      action={{ label: "Try Again", onPress: () => { refetch(); } }}
    />
  );
}

function EmptyProducts() {
  return (
    <EmptyState
      icon={Package}
      title="No products found"
      description="Check back later for new arrivals."
    />
  );
}

export default function ProductGrid({
  products = [],
  isPending,
  isError,
  refetch,
  onProductPress,
  listHeader,
  scrollHandler,
  variant = "grid",
}: ProductGridProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      await Promise.resolve(refetch());
    } finally {
      setIsRefreshing(false);
    }
  }

  // Without a listHeader, render standalone state views (used in collection screen)
  if (!listHeader) {
    if (isPending) return <SkeletonGrid />;
    if (isError) return <ErrorState refetch={refetch} />;
    if (products.length === 0) return <EmptyProducts />;
  }

  // With listHeader (home screen), keep FlatList always rendered so header stays visible
  const listEmptyComponent = isPending ? (
    <SkeletonGrid />
  ) : isError ? (
    <ErrorState refetch={refetch} />
  ) : products.length === 0 ? (
    <EmptyProducts />
  ) : null;

  if (variant === "featured") {
    return (
      <AnimatedFlatList
        data={(isPending || isError ? [] : products) as Product[]}
        numColumns={1}
        keyExtractor={(item) => (item as Product).id}
        contentContainerStyle={{
          paddingTop: Spacing.md,
          paddingBottom: 140,
          paddingHorizontal: 16,
          gap: 16,
        }}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        ListHeaderComponent={listHeader ?? undefined}
        ListEmptyComponent={listEmptyComponent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        renderItem={({ item, index }: { item: unknown; index: number }) => (
          <ProductCard.Root
            product={item as Product}
            staggerIndex={index}
            onPress={() => onProductPress?.(item as Product)}
          >
            <ProductCard.FeaturedLayout />
          </ProductCard.Root>
        )}
      />
    );
  }

  // variant === 'grid' (default) — keep all existing logic exactly
  return (
    <AnimatedFlatList
      data={(isPending || isError ? [] : products) as Product[]}
      numColumns={2}
      keyExtractor={(item) => (item as Product).id}
      columnWrapperStyle={{ gap: Spacing.sm, paddingHorizontal: Spacing.md }}
      contentContainerStyle={{ paddingTop: Spacing.md, paddingBottom: 120, gap: Spacing.sm }}
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
      ListHeaderComponent={listHeader ?? undefined}
      ListEmptyComponent={listEmptyComponent}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      renderItem={({ item, index }: { item: unknown; index: number }) => (
        <View style={{ flex: 1 }}>
          <ProductCard.Root
            product={item as Product}
            staggerIndex={index}
            onPress={() => onProductPress?.(item as Product)}
          >
            <ProductCard.Image />
            <ProductCard.Body>
              <ProductCard.Name />
              <ProductCard.Price />
            </ProductCard.Body>
          </ProductCard.Root>
        </View>
      )}
    />
  );
}
