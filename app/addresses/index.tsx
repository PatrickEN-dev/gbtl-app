import React from 'react'
import { View, FlatList, Pressable, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { MapPin, Plus } from 'lucide-react-native'
import ScreenWrapper from '@/components/layout/ScreenWrapper'
import Header from '@/components/layout/Header'
import Typography from '@/components/ui/Typography'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import { useAddressesStore } from '@/store/addressesStore'
import { useTranslation } from '@/lib/i18n'
import { useThemeColors } from '@/hooks/useThemeColors'
import type { Address } from '@/types'

function AddressCard({
  address,
  onSetDefault,
  onEdit,
  onDelete,
}: {
  address: Address
  onSetDefault: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const { t } = useTranslation()
  const colors = useThemeColors()
  return (
    <View
      className="bg-surface rounded-2xl p-4 mb-3"
      style={{
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className="flex-row justify-between items-start mb-2">
        <Typography variant="heading3">{address.label}</Typography>
        {address.isDefault ? (
          <Badge variant="accent">{t('addresses.default')}</Badge>
        ) : null}
      </View>
      <Typography>{address.recipient}</Typography>
      <Typography color="muted" variant="body-sm">
        {address.street}, {address.number}
        {address.complement ? ` — ${address.complement}` : ''}
      </Typography>
      <Typography color="muted" variant="body-sm">
        {address.neighborhood} — {address.city}/{address.state} · {address.zip}
      </Typography>
      <View className="flex-row gap-2 mt-3">
        {!address.isDefault ? (
          <Pressable onPress={onSetDefault} hitSlop={6}>
            <Typography variant="body-sm" color="accent">
              {t('addresses.setDefault')}
            </Typography>
          </Pressable>
        ) : null}
        <View className="flex-1" />
        <Pressable onPress={onEdit} hitSlop={6}>
          <Typography variant="body-sm" color="muted">
            {t('common.edit')}
          </Typography>
        </Pressable>
        <Pressable onPress={onDelete} hitSlop={6}>
          <Typography variant="body-sm" color="muted">
            {t('common.delete')}
          </Typography>
        </Pressable>
      </View>
    </View>
  )
}

export default function AddressesScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const colors = useThemeColors()
  const { addresses, setDefault, remove } = useAddressesStore()

  function confirmDelete(id: string) {
    Alert.alert(t('addresses.delete'), '', [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.delete'), style: 'destructive', onPress: () => remove(id) },
    ])
  }

  return (
    <ScreenWrapper header={<Header showBack roundedIcons title={t('addresses.title')} />}>
      {addresses.length === 0 ? (
        <View className="flex-1 px-6 pb-6">
          <EmptyState
            icon={MapPin}
            title={t('addresses.empty')}
            description={t('addresses.emptyDescription')}
            action={{
              label: t('addresses.add'),
              onPress: () => router.push('/addresses/new'),
            }}
          />
        </View>
      ) : (
        <>
          <FlatList
            data={addresses}
            keyExtractor={(a) => a.id}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <AddressCard
                address={item}
                onSetDefault={() => setDefault(item.id)}
                onEdit={() => router.push(`/addresses/new?id=${item.id}`)}
                onDelete={() => confirmDelete(item.id)}
              />
            )}
          />
          <View className="px-4 pb-4">
            <Button
              variant="primary"
              fullWidth
              rounded="pill"
              leftIcon={<Plus size={18} color={colors.surface} />}
              onPress={() => router.push('/addresses/new')}
            >
              {t('addresses.add')}
            </Button>
          </View>
        </>
      )}
    </ScreenWrapper>
  )
}
