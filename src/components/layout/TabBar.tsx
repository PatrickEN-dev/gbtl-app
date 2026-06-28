import React, { useEffect } from 'react'
import { Platform, View, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import { BlurView } from 'expo-blur'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Home, Grid, ShoppingBag } from 'lucide-react-native'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useColorScheme } from 'nativewind'
import Badge from '@/components/ui/Badge'
import { usePressScale, Duration } from '@/lib/animations'
import { useCart } from '@/hooks/useCart'
import { useCartUI } from '@/store/cartUIStore'
import { useThemeColors } from '@/hooks/useThemeColors'

const ROUTE_CONFIG: Record<
  string,
  { Icon: React.ComponentType<{ size: number; color: string }> }
> = {
  index: { Icon: Home },
  collection: { Icon: Grid },
  cart: { Icon: ShoppingBag },
}

interface TabItemProps {
  routeName: string
  isFocused: boolean
  onPress: () => void
  badgeCount: number
  iconColor: string
}

function TabItem({ routeName, isFocused, onPress, badgeCount, iconColor }: TabItemProps) {
  const press = usePressScale(0.9)
  const { Icon } = ROUTE_CONFIG[routeName] ?? { Icon: Home }
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
              <Badge variant="accent" size="sm">
                {badgeCount}
              </Badge>
            </View>
          )}
        </View>
        <View className="mt-1.5" style={{ width: 5, height: 5 }}>
          <Animated.View
            className="bg-primary rounded-full"
            style={[{ width: 5, height: 5 }, dotStyle]}
          />
        </View>
      </Animated.View>
    </Pressable>
  )
}

export default function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets()
  const { totalItems } = useCart()
  const openCart = useCartUI((s) => s.open)
  const colors = useThemeColors()
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'

  const tabs = state.routes.map((route, index) => {
    const isFocused = state.index === index
    const onPress = () => {
      if (route.name === 'cart') {
        openCart()
        return
      }
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
        isFocused={isFocused && route.name !== 'cart'}
        onPress={onPress}
        badgeCount={route.name === 'cart' ? totalItems : 0}
        iconColor={isFocused && route.name !== 'cart' ? colors.primary : colors.muted}
      />
    )
  })

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 16,
        paddingBottom: insets.bottom + 8,
      }}
    >
      <View
        style={{
          height: 64,
          borderRadius: 9999,
          overflow: 'hidden',
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.35 : 0.12,
          shadowRadius: 12,
          elevation: 8,
          backgroundColor: Platform.select({
            ios: isDark ? 'rgba(37,42,38,0.75)' : 'rgba(255,255,255,0.7)',
            default: colors.surface,
          }),
        }}
      >
        {Platform.OS === 'ios' && (
          <BlurView
            intensity={70}
            tint={isDark ? 'dark' : 'light'}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        )}
        <View className="flex-row flex-1">{tabs}</View>
      </View>
    </View>
  )
}
