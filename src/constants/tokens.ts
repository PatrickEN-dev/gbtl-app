// src/constants/tokens.ts
// JS constants mirroring tailwind.config — for logic only, NOT styling (use className for styling)

export const Colors = {
  bg:      '#F5F5F5',
  surface: '#FFFFFF',
  accent:  '#E8401C',
  primary: '#111111',
  muted:   '#888888',
  border:  '#E0E0E0',
  overlay: 'rgba(0,0,0,0.5)',
} as const

export const Radius = {
  card:  16,
  btn:   10,
  pill:  999,
  input: 10,
} as const

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
} as const

export const Duration = {
  fast: 150,
  base: 250,
  slow: 400,
  lazy: 600,
} as const
