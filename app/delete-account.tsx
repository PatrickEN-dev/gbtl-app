


import React, { useState } from 'react'
import { View, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import ScreenWrapper from '@/components/layout/ScreenWrapper'
import Header from '@/components/layout/Header'
import Typography from '@/components/ui/Typography'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useTranslation } from '@/lib/i18n'

export default function DeleteAccountScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const { logout } = useAuth()
  const clearCart = useCartStore((s) => s.clearCart)
  const clearWishlist = useWishlistStore((s) => s.clear)
  const [busy, setBusy] = useState(false)

  function handleDelete() {
    Alert.alert(t('legal.deleteAccountTitle'), t('legal.deleteAccountConfirm'), [
      { text: t('legal.deleteAccountCancel'), style: 'cancel' },
      {
        text: t('legal.deleteAccountAction'),
        style: 'destructive',
        onPress: async () => {
          setBusy(true)
          try {


            clearCart()
            clearWishlist()
            await logout()
          } finally {
            setBusy(false)
            router.replace('/(tabs)')
          }
        },
      },
    ])
  }

  return (
    <ScreenWrapper header={<Header showBack roundedIcons title={t('legal.deleteAccountTitle')} />}>
      <View className="flex-1 px-6 pt-6 justify-between" style={{ paddingBottom: 32 }}>
        <View className="gap-4">
          <Typography variant="heading2">{t('legal.deleteAccountTitle')}</Typography>
          <Typography variant="body" color="muted">
            {t('legal.deleteAccountConfirm')}
          </Typography>
          <Typography variant="body-sm" color="muted">
            This removes your Google-linked account from GBTL, deletes your cart and wishlist on
            this device, and revokes future access until you sign in again.
          </Typography>
        </View>
        <Button variant="primary" fullWidth rounded="pill" loading={busy} onPress={handleDelete}>
          {t('legal.deleteAccountAction')}
        </Button>
      </View>
    </ScreenWrapper>
  )
}
