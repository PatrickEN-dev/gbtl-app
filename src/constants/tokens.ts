// src/constants/tokens.ts
// JS constants mirroring tailwind.config — for logic only, NOT styling (use className for styling)

export const Colors = {
  bg:      '#F8F8F3',
  surface: '#FFFFFF',
  accent:  '#5C7C5F',
  primary: '#1A2018',
  muted:   '#8E948B',
  border:  '#E5E5E0',
  overlay: 'rgba(26,32,24,0.5)',
} as const

export const DarkColors = {
  bg:      '#1A1F1B',
  surface: '#252A26',
  accent:  '#8FB088',
  primary: '#F5F5F2',
  muted:   '#9C9F95',
  border:  '#3A3F3B',
  overlay: 'rgba(0,0,0,0.6)',
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
