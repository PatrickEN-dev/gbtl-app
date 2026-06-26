# Wave 1 / Task A — Config Files

## Spec source
Read GBTL_Prompt_v4.md section `## CONFIG FILES` (lines 50–174). That section has the exact file contents.

## Files to generate

1. `package.json` — use EXACT versions from CLAUDE.md Stack section; scripts: start/android/ios/web/build/lint
2. `babel.config.js` — presets: babel-preset-expo | plugins: [nativewind/babel, reanimated/plugin LAST]
3. `tailwind.config.js` — withNativeWind preset, full color+fontSize+borderRadius+shadow tokens from CLAUDE.md brand
4. `metro.config.js` — withNativeWind wrapper, input: ./global.css
5. `global.css` — @tailwind base/components/utilities only
6. `app.json` — name:GBTL slug:gbtl-app scheme:gbtl portrait splash:#E8401C ios:com.gbtl.app supportsTablet:false android:com.gbtl.app plugins:[expo-router,expo-font,expo-secure-store,["expo-notifications",{"color":"#E8401C"}],["expo-updates",{"username":"gbtl"}]] experiments.typedRoutes:true
7. `tsconfig.json` — extends:expo/tsconfig.base strict:true paths:@/*→./src/*
