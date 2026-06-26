// src/components/layout/TabBar.tsx
import React from 'react'
import { View, Pressable, Platform } from 'react-native'
import Animated from 'react-native-reanimated'
import { BlurView } from 'expo-blur'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Home, Grid, ShoppingBag, User } from 'lucide-react-native'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import Typography from '@/components/ui/Typography'
import Badge from '@/components/ui/Badge'
import { usePressScale } from '@/lib/animations'
import { useCart } from '@/hooks/useCart'
import { Colors } from '@/constants/tokens'

// Icon + label config keyed by expo-router tab file name (without extension)
const ROUTE_CONFIG: Record<
  string,
  { Icon: React.ComponentType<{ size: number; color: string }>; label: string }
> = {
  index: { Icon: Home, label: 'Home' },
  collection: { Icon: Grid, label: 'Collection' },
  cart: { Icon: ShoppingBag, label: 'Cart' },
  profile: { Icon: User, label: 'Profile' },
}

interface TabItemProps {
  routeName: string
  isFocused: boolean
  onPress: () => void
  badgeCount: number
}

function TabItem({ routeName, isFocused, onPress, badgeCount }: TabItemProps) {
  const press = usePressScale(0.9)
  const config = ROUTE_CONFIG[routeName] ?? { Icon: Home, label: routeName }
  const { Icon } = config
  const iconColor = isFocused ? Colors.accent : Colors.muted

  return (
    <Pressable
      onPress={onPress}
      onPressIn={press.handlePressIn}
      onPressOut={press.handlePressOut}
      className="flex-1 items-center justify-center py-2"
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
    >
      <Animated.View style={press.animatedStyle} className="items-center gap-0.5">
        <View className="relative">
          <Icon size={22} color={iconColor} />
          {badgeCount > 0 && (
            <View className="absolute -top-1 -right-2">
              <Badge variant="accent" size="sm">{badgeCount}</Badge>
            </View>
          )}
        </View>
        <Typography variant="caption" color={isFocused ? 'accent' : 'muted'}>
          {config.label}
        </Typography>
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
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      })
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

  const tabRow = (
    <View className="flex-row" style={{ paddingBottom: insets.bottom }}>
      {tabs}
    </View>
  )

  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={80} tint="light" className="border-t border-border">
        {tabRow}
      </BlurView>
    )
  }

  return (
    <View
      className="bg-surface border-t border-border"
      style={{
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      {tabRow}
    </View>
  )
}
