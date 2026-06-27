


import * as AuthSession from 'expo-auth-session'
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import Constants from 'expo-constants'

WebBrowser.maybeCompleteAuthSession()

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string>

export interface GoogleUser {
  id: string
  email: string
  name: string
  picture?: string
}

export function useGoogleSignIn() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: extra.googleClientIdIos,
    androidClientId: extra.googleClientIdAndroid,
    webClientId: extra.googleClientIdWeb,

    scopes: ['openid', 'profile', 'email'],
  })

  async function signIn(): Promise<GoogleUser | null> {
    const result = await promptAsync()
    if (result.type !== 'success') return null

    const accessToken = result.authentication?.accessToken
    if (!accessToken) return null


    const profileRes = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!profileRes.ok) return null

    type GoogleProfile = { id: string; email: string; name: string; picture?: string }
    const profile = (await profileRes.json()) as GoogleProfile
    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
    }
  }

  return {
    isReady: request != null,
    signIn,

    response: response as AuthSession.AuthSessionResult | null,
  }
}
