// src/components/layout/ScreenWrapper.tsx
import React from 'react'
import { View, KeyboardAvoidingView, Platform } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated'
import type { SharedValue } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type ScrollArgs = { scrollY: SharedValue<number> }
type RenderPropFn = (args: ScrollArgs) => React.ReactNode

interface ScreenWrapperProps {
  /**
   * When scrollable=true, children MUST be a render prop receiving { scrollY }.
   * When scrollable=false (default), children is a plain ReactNode.
   */
  children: React.ReactNode | RenderPropFn
  scrollable?: boolean
  header?: React.ReactNode
  className?: string
}

export default function ScreenWrapper({
  children,
  scrollable = false,
  header,
  className,
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets()
  const scrollY = useSharedValue(0)

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y
    },
  })

  if (scrollable) {
    const renderedContent =
      typeof children === 'function'
        ? (children as RenderPropFn)({ scrollY })
        : (children as React.ReactNode)

    return (
      <KeyboardAvoidingView
        className={`flex-1 bg-background ${className ?? ''}`}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {header}
        <Animated.ScrollView
          className="flex-1"
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom }}
        >
          {renderedContent}
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    )
  }

  return (
    <KeyboardAvoidingView
      className={`flex-1 bg-background ${className ?? ''}`}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {header}
      <View
        className="flex-1"
        style={{
          paddingTop: header ? 0 : insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        {children as React.ReactNode}
      </View>
    </KeyboardAvoidingView>
  )
}
