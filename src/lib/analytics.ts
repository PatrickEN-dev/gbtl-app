import { env, isMockValue } from '@/lib/env'
import { logger } from '@/lib/logger'

type EventProps = Record<string, string | number | boolean | null | undefined>

export type AnalyticsEvent =
  | 'app_opened'
  | 'screen_view'
  | 'product_viewed'
  | 'product_added_to_cart'
  | 'product_removed_from_cart'
  | 'cart_viewed'
  | 'cart_cleared'
  | 'wishlist_toggled'
  | 'checkout_started'
  | 'checkout_completed'
  | 'checkout_failed'
  | 'search_performed'
  | 'category_filtered'
  | 'sort_changed'
  | 'auth_started'
  | 'auth_completed'
  | 'auth_skipped'
  | 'logout'
  | 'coupon_applied'
  | 'coupon_invalid'
  | 'address_saved'
  | 'order_viewed'

interface PostHogShim {
  capture: (event: string, props?: EventProps) => void
  identify: (id: string, props?: EventProps) => void
  reset: () => void
  screen: (name: string, props?: EventProps) => void
  optIn: () => void
  optOut: () => void
}

let posthog: PostHogShim | null = null
let initialized = false
let optedOut = false

async function loadPostHog(): Promise<PostHogShim | null> {
  try {
    const mod: {
      PostHog?: new (key: string, opts: Record<string, unknown>) => PostHogShim
    } =
      // eslint-disable-next-line import/no-unresolved
      await import('posthog-react-native')
    if (!mod.PostHog) return null
    return new mod.PostHog(env.posthogApiKey, { host: env.posthogHost })
  } catch {
    // posthog-react-native not installed yet. To enable:
    //   npm i posthog-react-native
    // and set EXPO_PUBLIC_POSTHOG_API_KEY to a real value.
    return null
  }
}

export async function initAnalytics(): Promise<void> {
  if (initialized) return
  initialized = true

  if (isMockValue(env.posthogApiKey)) {
    return
  }

  posthog = await loadPostHog()
}

export function track(event: AnalyticsEvent, props?: EventProps): void {
  if (optedOut) return
  if (posthog) {
    posthog.capture(event, props)
  } else {
    logger.debug(`analytics.track:${event}`, props)
  }
}

export function trackScreen(name: string, params?: EventProps): void {
  if (optedOut) return
  if (posthog) {
    posthog.screen(name, params)
  } else {
    logger.debug(`analytics.screen:${name}`, params)
  }
}

export function identify(userId: string, traits?: EventProps): void {
  if (optedOut) return
  posthog?.identify(userId, traits)
}

export function resetAnalytics(): void {
  posthog?.reset()
}

export function optOut(): void {
  optedOut = true
  posthog?.optOut()
}

export function optIn(): void {
  optedOut = false
  posthog?.optIn()
}
