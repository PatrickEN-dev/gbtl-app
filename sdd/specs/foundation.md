# GBTL — Foundation Spec
# Scope: dependencies, config files
# Used by: Wave 1 / task-configs

## EXACT DEPENDENCY VERSIONS (use these, no substitutions)

```json
{
  "expo": "~54.0.34",
  "expo-router": "~6.0.23",
  "react-native": "0.81.5",
  "react-native-reanimated": "~4.1.1",
  "react-native-gesture-handler": "~2.28.0",
  "react-native-safe-area-context": "~5.6.0",
  "react-native-screens": "~4.16.0",
  "react-native-svg": "15.12.1",
  "nativewind": "^4.2.6",
  "tailwindcss": "^3.4.19",
  "zustand": "^5.0.14",
  "@tanstack/react-query": "^5.101.1",
  "react-hook-form": "^7.80.0",
  "@hookform/resolvers": "^5.4.0",
  "zod": "^3.25.76",
  "lucide-react-native": "^1.21.0",
  "expo-image": "~3.0.11",
  "expo-secure-store": "~15.0.8",
  "expo-notifications": "~0.32.17",
  "expo-updates": "~29.0.18",
  "expo-blur": "~15.0.8",
  "expo-status-bar": "~3.0.9",
  "expo-splash-screen": "~31.0.13",
  "expo-font": "~14.0.11",
  "@gorhom/bottom-sheet": "^5.2.14"
}
```

---

## babel.config.js
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin', // MUST be last
    ],
  };
};
```

## tailwind.config.js
```js
const { withNativeWind } = require('nativewind/metro');

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
```

## metro.config.js
```js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: './global.css' });
```

## global.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## app.json
```json
{
  "expo": {
    "name": "GBTL",
    "slug": "gbtl-app",
    "version": "1.0.0",
    "scheme": "gbtl",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
    "splash": { "backgroundColor": "#E8401C", "resizeMode": "contain" },
    "ios": {
      "bundleIdentifier": "com.gbtl.app",
      "supportsTablet": false,
      "infoPlist": {
        "NSCameraUsageDescription": "Used for profile photo.",
        "NSUserNotificationUsageDescription": "Stay updated on orders."
      }
    },
    "android": {
      "package": "com.gbtl.app",
      "adaptiveIcon": { "backgroundColor": "#E8401C" },
      "permissions": ["NOTIFICATIONS", "RECEIVE_BOOT_COMPLETED"]
    },
    "plugins": [
      "expo-router",
      "expo-font",
      "expo-secure-store",
      ["expo-notifications", { "color": "#E8401C" }],
      ["expo-updates", { "username": "gbtl" }]
    ],
    "experiments": { "typedRoutes": true }
  }
}
```

## tsconfig.json
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": { "@/*": ["./src/*"] }
  }
}
```
