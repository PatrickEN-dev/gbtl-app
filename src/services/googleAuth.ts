// src/services/googleAuth.ts
// Google Sign-In via expo-auth-session (PKCE flow, no backend needed).
//
// Setup required (see SETUP.md):
// 1. Create OAuth 2.0 Client IDs in Google Cloud Console (Web + iOS + Android)
// 2. Put them in app.json → expo.extra.googleClientIdIos / Android / Web
//
// Returns the Google user profile (id, email, name, picture) after successful sign-in.
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
    // We only need the basic profile.
    scopes: ['openid', 'profile', 'email'],
  })

  async function signIn(): Promise<GoogleUser | null> {
    const result = await promptAsync()
    if (result.type !== 'success') return null

    const accessToken = result.authentication?.accessToken
    if (!accessToken) return null

    // Fetch profile from Google's userinfo endpoint
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
    // Expose the AuthSession response for debugging / advanced flows
    response: response as AuthSession.AuthSessionResult | null,
  }
}
