// src/components/ui/Skeleton.tsx
import React from 'react'
import { View, type DimensionValue } from 'react-native'
import Animated from 'react-native-reanimated'
import { useShimmer } from '@/lib/animations'

// ─── Skeleton ────────────────────────────────────────────────────────────────

interface SkeletonProps {
  width: DimensionValue
  height: number
  borderRadius?: number
}

export function Skeleton({ width, height, borderRadius = 8 }: SkeletonProps) {
  const { animatedStyle } = useShimmer()

  return (
    <View
      className="bg-border"
      style={{ width, height, borderRadius, overflow: 'hidden' }}
    >
      <Animated.View
        className="absolute inset-y-0 bg-white/50"
        style={[animatedStyle, { width: 120 }]}
      />
    </View>
  )
}

// ─── SkeletonGroup ────────────────────────────────────────────────────────────

interface SkeletonGroupProps {
  children: React.ReactNode
  gap?: number
}

export function SkeletonGroup({ children, gap = 8 }: SkeletonGroupProps) {
  return (
    <View style={{ flexDirection: 'column', gap }}>
      {children}
    </View>
  )
}

// ─── ProductCardSkeleton ──────────────────────────────────────────────────────

export function ProductCardSkeleton() {
  return (
    <View className="w-full">
      <SkeletonGroup gap={8}>
        <Skeleton width="100%" height={200} borderRadius={12} />
        <Skeleton width="70%" height={16} />
        <Skeleton width="40%" height={14} />
      </SkeletonGroup>
    </View>
  )
}

// ─── ProductDetailSkeleton ────────────────────────────────────────────────────

export function ProductDetailSkeleton() {
  return (
    <View className="w-full">
      <SkeletonGroup gap={12}>
        <Skeleton width="100%" height={400} borderRadius={0} />
        <View className="px-4">
          <SkeletonGroup gap={8}>
            <Skeleton width="60%" height={24} />
            <Skeleton width="30%" height={20} />
            <Skeleton width="80%" height={14} />
            <Skeleton width="90%" height={14} />
            <Skeleton width="70%" height={14} />
          </SkeletonGroup>
        </View>
      </SkeletonGroup>
    </View>
  )
}
