import Constants from 'expo-constants'

interface Env {
  apiUrl: string
  googleClientIdIos: string
  googleClientIdAndroid: string
  googleClientIdWeb: string
  stripePublishableKey: string
  stripeMerchantId: string
  stripePaymentEndpoint: string
  expoProjectId: string
  sentryDsn: string
  sentryEnv: string
  posthogApiKey: string
  posthogHost: string
  appVariant: 'development' | 'staging' | 'production'
  useMockData: boolean
}

const raw = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>

function str(key: keyof Env, fallback = ''): string {
  const v = raw[key]
  return typeof v === 'string' ? v : fallback
}

function bool(key: keyof Env, fallback: boolean): boolean {
  const v = raw[key]
  if (typeof v === 'boolean') return v
  if (typeof v === 'string') return v === 'true'
  return fallback
}

export const env: Env = {
  apiUrl: str('apiUrl', 'https://api.gbtl.mock'),
  googleClientIdIos: str('googleClientIdIos'),
  googleClientIdAndroid: str('googleClientIdAndroid'),
  googleClientIdWeb: str('googleClientIdWeb'),
  stripePublishableKey: str('stripePublishableKey'),
  stripeMerchantId: str('stripeMerchantId', 'merchant.com.gbtl.app'),
  stripePaymentEndpoint: str('stripePaymentEndpoint'),
  expoProjectId: str('expoProjectId'),
  sentryDsn: str('sentryDsn'),
  sentryEnv: str('sentryEnv', 'development') as Env['sentryEnv'],
  posthogApiKey: str('posthogApiKey'),
  posthogHost: str('posthogHost', 'https://us.i.posthog.com'),
  appVariant: str('appVariant', 'development') as Env['appVariant'],
  useMockData: bool('useMockData', true),
}

export function isMockValue(value: string | undefined): boolean {
  if (!value) return true
  return (
    value.startsWith('PLACEHOLDER') ||
    value.includes('mock') ||
    value.includes('0000000') ||
    value === 'https://api.gbtl.mock' ||
    value === 'https://api.gbtl.mock/create-payment-intent'
  )
}

export const isDev = env.appVariant === 'development' || __DEV__
export const isProd = env.appVariant === 'production' && !__DEV__
