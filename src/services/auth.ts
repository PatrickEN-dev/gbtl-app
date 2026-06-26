// src/services/auth.ts
// Token is returned to the caller — NEVER stored inside this service or in Zustand.
// The caller is responsible for persisting it via expo-secure-store.

import type { AuthUser } from '@/types'

export function login(
  email: string,
  password: string
): Promise<{ user: AuthUser; token: string }> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          user: { id: '1', name: 'Tavorian', email: 'tavorian@gbtl.com' },
          token: 'mock.jwt.eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.fake',
        }),
      500
    )
  )
}

export function logout(): void {
  // No server-side session to invalidate in mock mode.
  // Caller clears SecureStore token and Zustand user state.
}
