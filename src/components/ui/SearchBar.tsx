
import React from 'react'
import { View, TextInput } from 'react-native'
import { Search, SlidersHorizontal } from 'lucide-react-native'
import Pill from '@/components/primitives/Pill'
import { useThemeColors } from '@/hooks/useThemeColors'


interface SearchBarProps {
  value: string
  onChangeText: (v: string) => void
  onFilterPress?: () => void
  placeholder?: string
}


export default function SearchBar({
  value,
  onChangeText,
  onFilterPress,
  placeholder = 'Search here',
}: SearchBarProps) {
  const colors = useThemeColors()

  return (
    <View
      className="bg-surface rounded-pill border border-border flex-row items-center pl-4 pr-1.5"
      style={{
        height: 48,

        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,

        elevation: 1,
      }}
    >

      <Search size={18} color={colors.muted} />


      <TextInput
        className="flex-1 ml-3 text-body text-primary"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={{ paddingVertical: 0 }}
      />


      <Pill
        variant="solid"
        tone="primary"
        size="md"
        leftIcon={<SlidersHorizontal size={14} color={colors.surface} />}
        onPress={onFilterPress}
      >
        Filter
      </Pill>
    </View>
  )
}
