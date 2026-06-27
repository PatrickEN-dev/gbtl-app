// src/components/ui/SearchBar.tsx
import React from 'react'
import { View, TextInput, Pressable } from 'react-native'
import Animated from 'react-native-reanimated'
import { Search, SlidersHorizontal } from 'lucide-react-native'
import Typography from '@/components/ui/Typography'
import { Colors } from '@/constants/tokens'
import { usePressScale } from '@/lib/animations'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchBarProps {
  value: string
  onChangeText: (v: string) => void
  onFilterPress?: () => void
  placeholder?: string
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SearchBar({
  value,
  onChangeText,
  onFilterPress,
  placeholder = 'Search here',
}: SearchBarProps) {
  const { animatedStyle, handlePressIn, handlePressOut } = usePressScale(0.95)

  return (
    <View
      className="bg-surface rounded-pill border border-border flex-row items-center pl-4 pr-1.5"
      style={{
        height: 48,
        // iOS shadow
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        // Android shadow
        elevation: 1,
      }}
    >
      {/* Left — search icon */}
      <Search size={18} color={Colors.muted} />

      {/* Middle — text input */}
      <TextInput
        className="flex-1 ml-3 text-body text-primary"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.muted}
        style={{ paddingVertical: 0 }}
      />

      {/* Right — filter button */}
      <Animated.View style={animatedStyle}>
        <Pressable
          className="rounded-pill bg-primary h-9 px-4 flex-row items-center gap-1.5"
          onPress={onFilterPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <SlidersHorizontal size={14} color={Colors.surface} />
          <Typography variant="body-sm" color="white" weight="semibold">
            Filter
          </Typography>
        </Pressable>
      </Animated.View>
    </View>
  )
}
