/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme tokens (defaults)
        bg:      '#F8F8F3',
        surface: '#FFFFFF',
        primary: '#1A2018',
        accent:  '#5C7C5F',
        muted:   '#8E948B',
        border:  '#E5E5E0',
        overlay: 'rgba(26,32,24,0.5)',

        // Dark theme tokens (used via dark: variant)
        'dark-bg':      '#1A1F1B',
        'dark-surface': '#252A26',
        'dark-primary': '#F5F5F2',
        'dark-accent':  '#8FB088',
        'dark-muted':   '#9C9F95',
        'dark-border':  '#3A3F3B',
        'dark-overlay': 'rgba(0,0,0,0.6)',
      },
      fontSize: {
        'display':  [40, { lineHeight: '44px', letterSpacing: '-1.5px', fontWeight: '700' }],
        'heading1': [28, { lineHeight: '34px', letterSpacing: '-0.5px', fontWeight: '700' }],
        'heading2': [22, { lineHeight: '28px', letterSpacing: '-0.3px', fontWeight: '600' }],
        'heading3': [18, { lineHeight: '24px', letterSpacing: '0px',   fontWeight: '600' }],
        'body':     [15, { lineHeight: '22px', letterSpacing: '0px',   fontWeight: '400' }],
        'body-sm':  [13, { lineHeight: '18px', letterSpacing: '0px',   fontWeight: '400' }],
        'caption':  [11, { lineHeight: '14px', letterSpacing: '0.5px', fontWeight: '500' }],
        'price':    [20, { lineHeight: '24px', letterSpacing: '-0.5px', fontWeight: '700' }],
      },
      borderRadius: { card: '16px', btn: '10px', pill: '999px', input: '10px' },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.08)',
        btn:  '0 4px 16px rgba(92,124,95,0.30)',
      },
    },
  },
  plugins: [],
};
