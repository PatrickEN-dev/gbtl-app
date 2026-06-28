import * as SecureStore from 'expo-secure-store'
import { logger } from '@/lib/logger'

const TOKEN_KEY = 'gbtl_auth_token'

// WHEN_UNLOCKED: token só pode ser lido com o device desbloqueado.
// Equivale a Keychain `kSecAttrAccessibleWhenUnlockedThisDeviceOnly` (iOS)
// e EncryptedSharedPreferences (Android) — chave amarrada ao hardware.
const SECURE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED,
  requireAuthentication: false,
}

export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY, SECURE_OPTIONS)
  } catch (e) {
    logger.warn('secureStore.get_failed', { msg: (e as Error).name })
    return null
  }
}

export async function setToken(token: string): Promise<void> {
  // Não persistir strings vazias ou anomalias
  if (!token || typeof token !== 'string' || token.length > 8000) {
    logger.warn('secureStore.set_rejected', { reason: 'invalid_token' })
    return
  }
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token, SECURE_OPTIONS)
  } catch (e) {
    logger.warn('secureStore.set_failed', { msg: (e as Error).name })
  }
}

export async function deleteToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY, SECURE_OPTIONS)
  } catch (e) {
    logger.warn('secureStore.delete_failed', { msg: (e as Error).name })
  }
}

export async function isSecureStoreAvailable(): Promise<boolean> {
  try {
    return await SecureStore.isAvailableAsync()
  } catch {
    return false
  }
}
