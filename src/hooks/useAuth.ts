// src/hooks/useAuth.ts
import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { login as authServiceLogin } from '@/services/auth'
import { getToken, setToken, deleteToken } from '@/lib/secureStore'

export function useAuth() {
  const store = useAuthStore()
  const queryClient = useQueryClient()

  const login = useCallback(
    async (email: string, password: string) => {
      store.setLoading(true)
      try {
        const { user, token } = await authServiceLogin(email, password)
        await setToken(token)
        store.setUser(user)
      } finally {
        store.setLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const logout = useCallback(async () => {
    store.clearUser()
    await deleteToken()
    queryClient.clear()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient])

  const restoreSession = useCallback(async () => {
    const token = await getToken()
    if (token) {
      store.setUser({ id: '1', name: 'Tavorian', email: 'tavorian@gbtl.com' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    login,
    logout,
    restoreSession,
  }
}
