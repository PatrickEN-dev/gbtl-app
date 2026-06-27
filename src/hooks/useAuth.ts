
import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { setToken, deleteToken, getToken } from '@/lib/secureStore'
import type { GoogleUser } from '@/services/googleAuth'

const SESSION_KEY = 'gbtl:user'


async function persistUser(user: GoogleUser) {


  await setToken(JSON.stringify({ id: user.id, email: user.email, name: user.name, picture: user.picture }))
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
  const setUser    = useAuthStore((s) => s.setUser)
  const clearUser  = useAuthStore((s) => s.clearUser)
  const setLoading = useAuthStore((s) => s.setLoading)
  const user            = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading       = useAuthStore((s) => s.isLoading)

  const queryClient = useQueryClient()


  const completeGoogleLogin = useCallback(
    async (g: GoogleUser) => {
      setLoading(true)
      try {
        await persistUser(g)
        setUser({ id: g.id, name: g.name, email: g.email, avatarUrl: g.picture })
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setUser],
  )

  const logout = useCallback(async () => {
    clearUser()
    await deleteToken()
    queryClient.clear()
  }, [clearUser, queryClient])

  const restoreSession = useCallback(async () => {
    const stored = await readPersistedUser()
    if (stored) {
      setUser({ id: stored.id, name: stored.name, email: stored.email, avatarUrl: stored.picture })
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
