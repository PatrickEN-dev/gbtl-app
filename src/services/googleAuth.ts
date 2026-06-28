import * as AuthSession from 'expo-auth-session'
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import { env, isMockValue } from '@/lib/env'
import { logger } from '@/lib/logger'
import { googleProfileSchema } from '@/schemas/product.schema'

WebBrowser.maybeCompleteAuthSession()

export interface GoogleUser {
  id: string
  email: string
  name: string
  picture?: string
}

export function useGoogleSignIn() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: env.googleClientIdIos,
    androidClientId: env.googleClientIdAndroid,
    webClientId: env.googleClientIdWeb,
    scopes: ['openid', 'profile', 'email'],
  })

  async function signIn(): Promise<GoogleUser | null> {
    if (
      isMockValue(env.googleClientIdIos) ||
      isMockValue(env.googleClientIdAndroid) ||
      isMockValue(env.googleClientIdWeb)
    ) {
      logger.warn('googleAuth.not_configured', {
        msg: 'Defina EXPO_PUBLIC_GOOGLE_CLIENT_ID_* no .env.',
      })
      return {
        id: 'mock-user-id',
        email: 'mock@gbtl.app',
        name: 'Mock User',
        picture: undefined,
      }
    }

    const result = await promptAsync()
    if (result.type !== 'success') {
      logger.info('googleAuth.cancelled', { type: result.type })
      return null
    }

    const accessToken = result.authentication?.accessToken
    if (!accessToken) return null

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10_000)
    try {
      const profileRes = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        credentials: 'omit',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      })
      if (!profileRes.ok) {
        logger.warn('googleAuth.profile_fetch_failed', {
          status: profileRes.status,
        })
        return null
      }

      const raw: unknown = await profileRes.json()
      const parsed = googleProfileSchema.safeParse(raw)
      if (!parsed.success) {
        logger.warn('googleAuth.invalid_profile')
        return null
      }
      return parsed.data
    } catch (e) {
      logger.warn('googleAuth.profile_error', {
        msg: e instanceof Error ? e.name : 'unknown',
      })
      return null
    } finally {
      clearTimeout(timeout)
    }
  }

  return {
    isReady: request != null,
    signIn,
    response: response as AuthSession.AuthSessionResult | null,
  }
}
