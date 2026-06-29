import React, { useEffect } from 'react'
import { Platform, View, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import { BlurView } from 'expo-blur'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Home, Grid, Heart, ShoppingBag } from 'lucide-react-native'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useColorScheme } from 'nativewind'
import { useRouter } from 'expo-router'
import Badge from '@/components/ui/Badge'
import { usePressScale, Duration } from '@/lib/animations'
import { useCart } from '@/hooks/useCart'
import { useCartUI } from '@/store/cartUIStore'
import { useThemeColors } from '@/hooks/useThemeColors'

type TabKey = 'index' | 'collection' | 'wishlist' | 'cart'

const TAB_ITEMS: {
  key: TabKey
  Icon: React.ComponentType<{ size: number; color: string }>
}[] = [
  { key: 'index', Icon: Home },
  { key: 'collection', Icon: Grid },
  { key: 'wishlist', Icon: Heart },
  { key: 'cart', Icon: ShoppingBag },
]

interface TabItemProps {
  Icon: React.ComponentType<{ size: number; color: string }>
  isFocused: boolean
  onPress: () => void
  badgeCount: number
  iconColor: string
}

function TabItem({ Icon, isFocused, onPress, badgeCount, iconColor }: TabItemProps) {
  const press = usePressScale(0.9)
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
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { totalItems } = useCart()
  const openCart = useCartUI((s) => s.open)
  const colors = useThemeColors()
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'

  const currentRouteName = state.routes[state.index]?.name

  function handlePress(tabKey: TabKey) {
    if (tabKey === 'cart') {
      openCart()
      return
    }
    if (tabKey === 'wishlist') {
      router.push('/wishlist')
      return
    }
    if (currentRouteName === tabKey) return
    navigation.navigate(tabKey as never)
  }

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
          shadowOpacity: isDark ? 0.28 : 0.1,
          shadowRadius: 14,
          elevation: 8,
          backgroundColor: Platform.select({
            ios: isDark ? 'rgba(37,42,38,0.45)' : 'rgba(255,255,255,0.4)',
            default: isDark ? 'rgba(37,42,38,0.78)' : 'rgba(255,255,255,0.78)',
          }),
        }}
      >
        {Platform.OS === 'ios' && (
          <BlurView
            intensity={90}
            tint={isDark ? 'dark' : 'light'}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        )}
        <View className="flex-row flex-1">
          {TAB_ITEMS.map(({ key, Icon }) => {
            const isRouteFocused =
              key === currentRouteName && key !== 'cart' && key !== 'wishlist'
            return (
              <TabItem
                key={key}
                Icon={Icon}
                isFocused={isRouteFocused}
                onPress={() => handlePress(key)}
                badgeCount={key === 'cart' ? totalItems : 0}
                iconColor={isRouteFocused ? colors.primary : colors.muted}
              />
            )
          })}
        </View>
      </View>
    </View>
  )
}
