// app/(tabs)/_layout.tsx
import React from 'react'
import { Tabs } from 'expo-router'
import TabBar from '@/components/layout/TabBar'

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="collection" />
      <Tabs.Screen name="cart" />
    </Tabs>
  )
}
