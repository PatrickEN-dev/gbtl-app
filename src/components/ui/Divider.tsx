// src/components/ui/Divider.tsx
import React from 'react'
import { View } from 'react-native'

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
}

export default function Divider({ orientation = 'horizontal' }: DividerProps) {
  if (orientation === 'vertical') {
    return <View className="h-full w-px bg-border" />
  }
  return <View className="w-full h-px bg-border" />
}
