// src/hooks/useThemeColors.ts
import { useColorScheme } from 'nativewind'
import { Colors, DarkColors } from '@/constants/tokens'

export type ThemeColors = {
  bg: string
  surface: string
  accent: string
  primary: string
  muted: string
  border: string
  overlay: string
}

export function useThemeColors(): ThemeColors {
  const { colorScheme } = useColorScheme()
  return colorScheme === 'dark' ? DarkColors : Colors
}
