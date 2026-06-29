import React, { useEffect, useState } from 'react'
import { ScrollView, View, Pressable, Switch } from 'react-native'
import { useRouter } from 'expo-router'
import {
  ChevronRight,
  Heart,
  Package,
  MapPin,
  LogOut,
  Bell,
  Globe,
  Shield,
  FileText,
  Trash2,
} from 'lucide-react-native'
import { useColorScheme } from 'nativewind'
import ScreenWrapper from '@/components/layout/ScreenWrapper'
import Header from '@/components/layout/Header'
import Typography from '@/components/ui/Typography'
import { useAuth } from '@/hooks/useAuth'
import { useThemeColors } from '@/hooks/useThemeColors'
import { useThemeStore } from '@/store/themeStore'
import i18n, { useTranslation } from '@/lib/i18n'
import { registerForPushNotificationsAsync } from '@/services/notifications'
import { optIn, optOut, track } from '@/lib/analytics'
import { showToast } from '@/store/toastStore'
import { confirm } from '@/store/confirmStore'

function Row({
  icon,
  label,
  value,
  onPress,
  destructive,
}: {
  icon: React.ReactNode
  label: string
  value?: string
  onPress?: () => void
  destructive?: boolean
}) {
  const colors = useThemeColors()
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center bg-surface px-4 py-4 border-b border-border"
    >
      <View className="w-7 h-7 items-center justify-center mr-3">{icon}</View>
      <View className="flex-1">
        <Typography variant="body" color={destructive ? 'accent' : 'primary'}>
          {label}
        </Typography>
        {value ? (
          <Typography variant="body-sm" color="muted">
            {value}
          </Typography>
        ) : null}
      </View>
      {onPress ? <ChevronRight size={18} color={colors.muted} /> : null}
    </Pressable>
  )
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Typography variant="caption" color="muted" className="px-4 pt-6 pb-2 uppercase">
      {children}
    </Typography>
  )
}

export default function SettingsScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const colors = useThemeColors()
  const { user, isAuthenticated, logout } = useAuth()
  const themePreference = useThemeStore((s) => s.preference)
  const setThemePreference = useThemeStore((s) => s.setPreference)
  const { setColorScheme } = useColorScheme()
  const [pushEnabled, setPushEnabled] = useState(false)
  const [trackingOptOut, setTrackingOptOut] = useState(false)
  const [language, setLanguage] = useState(i18n.language)

  useEffect(() => {
    setColorScheme(themePreference)
  }, [themePreference, setColorScheme])

  async function togglePush() {
    if (pushEnabled) {
      setPushEnabled(false)
      return
    }
    const token = await registerForPushNotificationsAsync()
    setPushEnabled(!!token)
    if (!token) {
      showToast({
        type: 'warning',
        title: t('settings.notifications'),
        message: t('settings.notificationsOff'),
      })
    }
  }

  function toggleLanguage() {
    const next = language === 'pt-BR' ? 'en' : 'pt-BR'
    i18n.changeLanguage(next)
    setLanguage(next)
  }

  function toggleTracking(value: boolean) {
    setTrackingOptOut(value)
    if (value) {
      optOut()
    } else {
      optIn()
    }
  }

  async function handleLogout() {
    const ok = await confirm({
      title: t('settings.signOut'),
      confirmLabel: t('settings.signOut'),
      cancelLabel: t('common.cancel'),
      destructive: true,
    })
    if (!ok) return
    await logout()
    router.replace('/(tabs)')
  }

  function cycleTheme() {
    const next =
      themePreference === 'light'
        ? 'dark'
        : themePreference === 'dark'
          ? 'system'
          : 'light'
    setThemePreference(next)
    track('screen_view', { screen: 'settings', action: 'theme_change', value: next })
  }

  const themeLabel =
    themePreference === 'light'
      ? t('settings.themeLight')
      : themePreference === 'dark'
        ? t('settings.themeDark')
        : t('settings.themeSystem')

  return (
    <ScreenWrapper header={<Header showBack roundedIcons title={t('settings.title')} />}>
      <ScrollView className="flex-1">
        <SectionTitle>{t('settings.account')}</SectionTitle>
        <View className="bg-surface">
          <Row
            icon={<Globe size={18} color={colors.primary} />}
            label={isAuthenticated ? (user?.name ?? '') : t('settings.guest')}
            value={isAuthenticated ? user?.email : undefined}
            onPress={!isAuthenticated ? () => router.push('/(auth)/login') : undefined}
          />
        </View>

        <SectionTitle>{t('settings.preferences')}</SectionTitle>
        <View className="bg-surface">
          <Row
            icon={<Package size={18} color={colors.primary} />}
            label={t('settings.orders')}
            onPress={() => router.push('/orders')}
          />
          <Row
            icon={<MapPin size={18} color={colors.primary} />}
            label={t('settings.addresses')}
            onPress={() => router.push('/addresses')}
          />
          <Row
            icon={<Heart size={18} color={colors.primary} />}
            label={t('settings.wishlist')}
            onPress={() => router.push('/wishlist')}
          />
          <Row
            icon={<Globe size={18} color={colors.primary} />}
            label={t('settings.language')}
            value={language === 'pt-BR' ? 'Português (BR)' : 'English'}
            onPress={toggleLanguage}
          />
          <Row
            icon={<Globe size={18} color={colors.primary} />}
            label={t('settings.theme')}
            value={themeLabel}
            onPress={cycleTheme}
          />
          <View className="flex-row items-center bg-surface px-4 py-3 border-b border-border">
            <View className="w-7 h-7 items-center justify-center mr-3">
              <Bell size={18} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Typography variant="body">{t('settings.notifications')}</Typography>
              <Typography variant="body-sm" color="muted">
                {pushEnabled
                  ? t('settings.notificationsOn')
                  : t('settings.notificationsOff')}
              </Typography>
            </View>
            <Switch value={pushEnabled} onValueChange={togglePush} />
          </View>
          <View className="flex-row items-center bg-surface px-4 py-3 border-b border-border">
            <View className="w-7 h-7 items-center justify-center mr-3">
              <Shield size={18} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Typography variant="body">{t('settings.trackingOptOut')}</Typography>
            </View>
            <Switch value={trackingOptOut} onValueChange={toggleTracking} />
          </View>
        </View>

        <SectionTitle>{t('settings.about')}</SectionTitle>
        <View className="bg-surface">
          <Row
            icon={<Shield size={18} color={colors.primary} />}
            label={t('settings.privacy')}
            onPress={() => router.push('/privacy')}
          />
          <Row
            icon={<FileText size={18} color={colors.primary} />}
            label={t('settings.terms')}
            onPress={() => router.push('/terms')}
          />
          <Row
            icon={<Trash2 size={18} color={colors.accent} />}
            label={t('settings.deleteAccount')}
            onPress={() => router.push('/delete-account')}
            destructive
          />
        </View>

        {isAuthenticated ? (
          <View className="mt-4 mb-10 px-4">
            <Pressable
              onPress={handleLogout}
              className="bg-surface rounded-2xl py-4 flex-row items-center justify-center gap-2"
            >
              <LogOut size={18} color={colors.accent} />
              <Typography color="accent" weight="semibold">
                {t('settings.signOut')}
              </Typography>
            </Pressable>
          </View>
        ) : null}

        <Typography variant="caption" color="muted" className="text-center py-6">
          {t('settings.version', { version: '1.0.0' })}
        </Typography>
      </ScrollView>
    </ScreenWrapper>
  )
}
