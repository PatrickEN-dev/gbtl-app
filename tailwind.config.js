/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg:      '#F5F5F5',
        surface: '#FFFFFF',
        accent:  '#E8401C',
        primary: '#111111',
        muted:   '#888888',
        border:  '#E0E0E0',
        overlay: 'rgba(0,0,0,0.5)',
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
        btn:  '0 4px 16px rgba(232,64,28,0.30)',
      },
    },
  },
  plugins: [],
};
