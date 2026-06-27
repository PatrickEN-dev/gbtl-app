// src/hooks/useAuth.ts
import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { login as authServiceLogin } from '@/services/auth'
import { getToken, setToken, deleteToken } from '@/lib/secureStore'

export function useAuth() {
  // Zustand action selectors: each returns a stable reference that never changes
  const setUser    = useAuthStore((s) => s.setUser)
  const clearUser  = useAuthStore((s) => s.clearUser)
  const setLoading = useAuthStore((s) => s.setLoading)
  const user           = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading      = useAuthStore((s) => s.isLoading)

  const queryClient = useQueryClient()

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true)
      try {
        const { user: u, token } = await authServiceLogin(email, password)
        await setToken(token)
        setUser(u)
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
    const token = await getToken()
    if (token) {
      setUser({ id: '1', name: 'Tavorian', email: 'tavorian@gbtl.com' })
    }
  }, [setUser])

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    restoreSession,
  }
}
