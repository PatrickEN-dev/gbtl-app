// src/components/layout/TabBar.tsx
import React, { useEffect } from 'react'
import { View, Pressable } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Home, Grid, ShoppingBag, User } from 'lucide-react-native'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import Badge from '@/components/ui/Badge'
import { usePressScale, Duration } from '@/lib/animations'
import { useCart } from '@/hooks/useCart'
import { Colors } from '@/constants/tokens'

const ROUTE_CONFIG: Record<string, { Icon: React.ComponentType<{ size: number; color: string }> }> = {
  index:      { Icon: Home },
  collection: { Icon: Grid },
  cart:       { Icon: ShoppingBag },
  profile:    { Icon: User },
}

interface TabItemProps {
  routeName: string
  isFocused: boolean
  onPress: () => void
  badgeCount: number
}

function TabItem({ routeName, isFocused, onPress, badgeCount }: TabItemProps) {
  const press = usePressScale(0.9)
  const { Icon } = ROUTE_CONFIG[routeName] ?? { Icon: Home }
  const iconColor = isFocused ? Colors.primary : Colors.muted
  const dotOpacity = useSharedValue(isFocused ? 1 : 0)

  useEffect(() => {
    dotOpacity.value = withTiming(isFocused ? 1 : 0, { duration: Duration.fast })
  }, [isFocused])

  const dotStyle = useAnimatedStyle(() => ({ opacity: dotOpacity.value }))

  return (
    <Pressable
      onPress={onPress}
      onPressIn={press.handlePressIn}
      onPressOut={press.handlePressOut}
      className="flex-1 items-center justify-center"
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
    >
      <Animated.View style={press.animatedStyle} className="items-center">
        <View className="relative">
          <Icon size={24} color={iconColor} />
          {badgeCount > 0 && (
            <View className="absolute -top-1 -right-2">
              <Badge variant="accent" size="sm">{badgeCount}</Badge>
            </View>
          )}
        </View>
        <View className="mt-1.5" style={{ width: 5, height: 5 }}>
          <Animated.View className="bg-primary rounded-full" style={[{ width: 5, height: 5 }, dotStyle]} />
        </View>
      </Animated.View>
    </Pressable>
  )
}

export default function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets()
  const { totalItems } = useCart()

  const tabs = state.routes.map((route, index) => {
    const isFocused = state.index === index
    const onPress = () => {
      const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true })
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name as never)
      }
    }
    return (
      <TabItem
        key={route.key}
        routeName={route.name}
        isFocused={isFocused}
        onPress={onPress}
        badgeCount={route.name === 'cart' ? totalItems : 0}
      />
    )
  })

  return (
    <View
      pointerEvents="box-none"
      style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 16, paddingBottom: insets.bottom + 8 }}
    >
      <View
        className="bg-surface rounded-pill flex-row"
        style={{
          height: 64,
          shadowColor: Colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        {tabs}
      </View>
    </View>
  )
}
