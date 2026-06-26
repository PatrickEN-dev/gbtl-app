// src/store/authStore.ts
import { create } from 'zustand'
import type { AuthUser } from '@/types'

// NEVER store token in Zustand state — token lives in SecureStore only

interface AuthStore {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: AuthUser) => void
  clearUser: () => void
  setLoading: (isLoading: boolean) => void
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) => set({ user, isAuthenticated: true }),

  clearUser: () => set({ user: null, isAuthenticated: false }),

  setLoading: (isLoading) => set({ isLoading }),
}))
