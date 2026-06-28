import type { ExpoConfig, ConfigContext } from 'expo/config'

const env = (key: string, fallback = '') => process.env[key] ?? fallback

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'GBTL',
  slug: 'gbtl-app',
  version: '1.0.0',
  runtimeVersion: '1.0.0',
  scheme: 'gbtl',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  icon: './assets/images/icon.png',
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#FFFFFF',
    dark: {
      image: './assets/images/splash-icon.png',
      backgroundColor: '#1A1F1B',
    },
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: 'com.gbtl.app',
    buildNumber: '1',
    supportsTablet: false,
    infoPlist: {
      NSUserNotificationUsageDescription: 'Stay updated on orders and offers.',
    },
    associatedDomains: ['applinks:gbtl.app'],
  },
  android: {
    package: 'com.gbtl.app',
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundColor: '#FFFFFF',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    permissions: ['NOTIFICATIONS', 'RECEIVE_BOOT_COMPLETED'],
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [{ scheme: 'https', host: 'gbtl.app', pathPrefix: '/product' }],
        category: ['BROWSER', 'DEFAULT'],
      },
    ],
  },
  plugins: [
    'expo-router',
    'expo-font',
    'expo-secure-store',
    'expo-localization',
    ['expo-updates', { username: 'gbtl' }],
  ],
  experiments: { typedRoutes: false },
  extra: {
    apiUrl: env('EXPO_PUBLIC_API_URL', 'https://api.gbtl.mock'),
    googleClientIdIos: env(
      'EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS',
      '000000000000-mockiosclientid.apps.googleusercontent.com',
    ),
    googleClientIdAndroid: env(
      'EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID',
      '000000000000-mockandroidclientid.apps.googleusercontent.com',
    ),
    googleClientIdWeb: env(
      'EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB',
      '000000000000-mockwebclientid.apps.googleusercontent.com',
    ),
    stripePublishableKey: env(
      'EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      'pk_test_mock00000000000000000000000000000000000000000000000000',
    ),
    stripeMerchantId: env('EXPO_PUBLIC_STRIPE_MERCHANT_ID', 'merchant.com.gbtl.app'),
    stripePaymentEndpoint: env(
      'EXPO_PUBLIC_STRIPE_PAYMENT_ENDPOINT',
      'https://api.gbtl.mock/create-payment-intent',
    ),
    expoProjectId: env(
      'EXPO_PUBLIC_EXPO_PROJECT_ID',
      '00000000-0000-0000-0000-000000000000',
    ),
    sentryDsn: env(
      'EXPO_PUBLIC_SENTRY_DSN',
      'https://mock@o0000000.ingest.sentry.io/0000000',
    ),
    sentryEnv: env('EXPO_PUBLIC_SENTRY_ENV', 'development'),
    posthogApiKey: env(
      'EXPO_PUBLIC_POSTHOG_API_KEY',
      'phc_mockprojectapikey0000000000000000000000000000000',
    ),
    posthogHost: env('EXPO_PUBLIC_POSTHOG_HOST', 'https://us.i.posthog.com'),
    appVariant: env('EXPO_PUBLIC_APP_VARIANT', 'development'),
    useMockData: env('EXPO_PUBLIC_USE_MOCK_DATA', 'true') === 'true',
  },
})
