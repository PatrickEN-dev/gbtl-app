import { Platform } from 'react-native'
import { env, isMockValue } from '@/lib/env'
import { logger } from '@/lib/logger'

interface NotificationsModule {
  getPermissionsAsync: () => Promise<{ status: string }>
  requestPermissionsAsync: () => Promise<{ status: string }>
  getExpoPushTokenAsync: (opts: { projectId: string }) => Promise<{ data: string }>
  setNotificationChannelAsync: (
    id: string,
    opts: Record<string, unknown>,
  ) => Promise<unknown>
  setNotificationHandler: (handler: Record<string, unknown>) => void
  AndroidImportance: { DEFAULT: number; HIGH: number }
  addNotificationReceivedListener: (cb: (n: unknown) => void) => { remove: () => void }
  addNotificationResponseReceivedListener: (cb: (n: unknown) => void) => {
    remove: () => void
  }
}

interface DeviceModule {
  isDevice: boolean
}

let Notifications: NotificationsModule | null = null
let Device: DeviceModule | null = null
let modulesLoaded = false

async function loadModules(): Promise<boolean> {
  if (modulesLoaded) return Notifications !== null
  modulesLoaded = true
  try {
    const [n, d] = await Promise.all([
      // eslint-disable-next-line import/no-unresolved
      import('expo-notifications') as Promise<unknown>,
      // eslint-disable-next-line import/no-unresolved
      import('expo-device') as Promise<unknown>,
    ])
    Notifications = n as NotificationsModule
    Device = d as DeviceModule
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    })
    return true
  } catch {
    logger.warn('notifications.modules_unavailable', {
      msg: 'Install expo-notifications + expo-device to enable push.',
    })
    return false
  }
}

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (isMockValue(env.expoProjectId)) {
    logger.debug('notifications.skip', { reason: 'mock expoProjectId' })
    return null
  }

  const ready = await loadModules()
  if (!ready || !Notifications || !Device) return null

  if (!Device.isDevice) {
    logger.info('notifications.skip', { reason: 'emulator/simulator' })
    return null
  }

  const { status: existing } = await Notifications.getPermissionsAsync()
  let status = existing
  if (existing !== 'granted') {
    const { status: requested } = await Notifications.requestPermissionsAsync()
    status = requested
  }
  if (status !== 'granted') {
    logger.info('notifications.permission_denied')
    return null
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#5C7C5F',
    })
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: env.expoProjectId,
    })
    logger.info('notifications.registered', { tokenLen: token.data.length })
    return token.data
  } catch (e) {
    logger.error(e, { op: 'notifications.getExpoPushTokenAsync' })
    return null
  }
}

export async function addNotificationListeners(
  onReceived?: (n: unknown) => void,
  onResponse?: (n: unknown) => void,
): Promise<() => void> {
  const ready = await loadModules()
  if (!ready || !Notifications) return () => {}

  const sub1 = onReceived
    ? Notifications.addNotificationReceivedListener(onReceived)
    : null
  const sub2 = onResponse
    ? Notifications.addNotificationResponseReceivedListener(onResponse)
    : null

  return () => {
    sub1?.remove()
    sub2?.remove()
  }
}
