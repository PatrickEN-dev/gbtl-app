import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { setToken, deleteToken, getToken } from '@/lib/secureStore'
import { identify, resetAnalytics, track } from '@/lib/analytics'
import { identifyUser } from '@/lib/monitoring'
import type { GoogleUser } from '@/services/googleAuth'

async function persistUser(user: GoogleUser) {
  await setToken(
    JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    }),
  )
}

async function readPersistedUser(): Promise<GoogleUser | null> {
  const raw = await getToken()
  if (!raw) return null
  try {
    return JSON.parse(raw) as GoogleUser
  } catch {
    return null
  }
}

export function useAuth() {
  const setUser = useAuthStore((s) => s.setUser)
  const clearUser = useAuthStore((s) => s.clearUser)
  const setLoading = useAuthStore((s) => s.setLoading)
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)

  const queryClient = useQueryClient()

  const completeGoogleLogin = useCallback(
    async (g: GoogleUser) => {
      setLoading(true)
      try {
        await persistUser(g)
        setUser({ id: g.id, name: g.name, email: g.email, avatarUrl: g.picture })
        identify(g.id, { email: g.email })
        identifyUser({ id: g.id, email: g.email })
        track('auth_completed', { provider: 'google' })
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setUser],
  )

  const logout = useCallback(async () => {
    track('logout')
    clearUser()
    await deleteToken()
    queryClient.clear()
    resetAnalytics()
    identifyUser(null)
  }, [clearUser, queryClient])

  const restoreSession = useCallback(async () => {
    const stored = await readPersistedUser()
    if (stored) {
      setUser({
        id: stored.id,
        name: stored.name,
        email: stored.email,
        avatarUrl: stored.picture,
      })
      identify(stored.id, { email: stored.email })
      identifyUser({ id: stored.id, email: stored.email })
    }
  }, [setUser])

  return {
    user,
    isAuthenticated,
    isLoading,
    completeGoogleLogin,
    logout,
    restoreSession,
  }
}
