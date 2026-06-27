
import React from 'react'
import { View, KeyboardAvoidingView, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface ScreenWrapperProps {
  children: React.ReactNode
  header?: React.ReactNode
  className?: string
}

export default function ScreenWrapper({
  children,
  header,
  className,
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets()

  return (
    <KeyboardAvoidingView
      className={`flex-1 bg-bg ${className ?? ''}`}
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
        {children}
      </View>
    </KeyboardAvoidingView>
  )
}
