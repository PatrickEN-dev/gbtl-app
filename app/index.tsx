import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import { Redirect } from 'expo-router'
import { useOnboarding } from '@/hooks/useOnboarding'
import { useThemeColors } from '@/hooks/useThemeColors'

export default function Index() {
  const { state } = useOnboarding()
  const colors = useThemeColors()

  if (state === 'loading') {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    )
  }

  if (state === 'pending') {
    return <Redirect href="/onboarding" />
  }

  return <Redirect href="/(tabs)" />
}
