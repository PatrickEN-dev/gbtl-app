import React, { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import ScreenWrapper from '@/components/layout/ScreenWrapper'
import Header from '@/components/layout/Header'
import Typography from '@/components/ui/Typography'
import Button from '@/components/ui/Button'
import { Field } from '@/components/forms/Field'
import { addressSchema, type AddressFormData } from '@/schemas/address.schema'
import { useAddressesStore } from '@/store/addressesStore'
import { lookupZip, normalizeZip } from '@/services/addresses'
import { useTranslation } from '@/lib/i18n'
import { track } from '@/lib/analytics'
import { showToast } from '@/store/toastStore'

export default function NewAddressScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const params = useLocalSearchParams<{ id?: string }>()
  const { addresses, add, update } = useAddressesStore()
  const existing = params.id ? addresses.find((a) => a.id === params.id) : undefined
  const [zipLoading, setZipLoading] = useState(false)

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: existing?.label ?? '',
      recipient: existing?.recipient ?? '',
      zip: existing?.zip ?? '',
      street: existing?.street ?? '',
      number: existing?.number ?? '',
      complement: existing?.complement ?? '',
      neighborhood: existing?.neighborhood ?? '',
      city: existing?.city ?? '',
      state: existing?.state ?? '',
      country: existing?.country ?? 'BR',
      phone: existing?.phone ?? '',
    },
  })

  const zipValue = watch('zip')

  useEffect(() => {
    const digits = normalizeZip(zipValue ?? '')
    if (digits.length !== 8) return
    let canceled = false
    setZipLoading(true)
    lookupZip(digits)
      .then((result) => {
        if (canceled) return
        if (!result) {
          showToast({ type: 'error', title: t('addresses.zipLookupFailed') })
          return
        }
        setValue('zip', result.zip)
        setValue('street', result.street)
        setValue('neighborhood', result.neighborhood)
        setValue('city', result.city)
        setValue('state', result.state)
        setValue('country', 'BR')
      })
      .finally(() => {
        if (!canceled) setZipLoading(false)
      })
    return () => {
      canceled = true
    }
  }, [zipValue, setValue, t])

  const onSubmit = (data: AddressFormData) => {
    if (existing) {
      update(existing.id, data)
    } else {
      add(data)
      track('address_saved')
    }
    router.back()
  }

  return (
    <ScreenWrapper
      header={
        <Header
          showBack
          roundedIcons
          title={existing ? t('addresses.edit') : t('addresses.add')}
        />
      }
    >
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <Field.Root control={control} name="label">
          <Field.Label>{t('addresses.label')}</Field.Label>
          <Field.Input autoCapitalize="words" returnKeyType="next" />
          <Field.Error />
        </Field.Root>

        <Field.Root control={control} name="recipient">
          <Field.Label>{t('addresses.recipient')}</Field.Label>
          <Field.Input autoCapitalize="words" returnKeyType="next" />
          <Field.Error />
        </Field.Root>

        <Field.Root control={control} name="zip">
          <Field.Label>
            {t('addresses.zip')} {zipLoading ? '...' : ''}
          </Field.Label>
          <Field.Input keyboardType="number-pad" maxLength={9} returnKeyType="next" />
          <Field.Error />
        </Field.Root>

        <Field.Root control={control} name="street">
          <Field.Label>{t('addresses.street')}</Field.Label>
          <Field.Input autoCapitalize="words" />
          <Field.Error />
        </Field.Root>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Field.Root control={control} name="number">
              <Field.Label>{t('addresses.number')}</Field.Label>
              <Field.Input keyboardType="number-pad" />
              <Field.Error />
            </Field.Root>
          </View>
          <View className="flex-[2]">
            <Field.Root control={control} name="complement">
              <Field.Label>{t('addresses.complement')}</Field.Label>
              <Field.Input autoCapitalize="words" />
              <Field.Error />
            </Field.Root>
          </View>
        </View>

        <Field.Root control={control} name="neighborhood">
          <Field.Label>{t('addresses.neighborhood')}</Field.Label>
          <Field.Input autoCapitalize="words" />
          <Field.Error />
        </Field.Root>

        <View className="flex-row gap-3">
          <View className="flex-[2]">
            <Field.Root control={control} name="city">
              <Field.Label>{t('addresses.city')}</Field.Label>
              <Field.Input autoCapitalize="words" />
              <Field.Error />
            </Field.Root>
          </View>
          <View className="flex-1">
            <Field.Root control={control} name="state">
              <Field.Label>{t('addresses.state')}</Field.Label>
              <Field.Input autoCapitalize="characters" maxLength={2} />
              <Field.Error />
            </Field.Root>
          </View>
        </View>

        <Field.Root control={control} name="phone">
          <Field.Label>{t('addresses.phone')}</Field.Label>
          <Field.Input keyboardType="phone-pad" />
          <Field.Error />
        </Field.Root>

        <View className="mt-4 mb-6">
          <Button
            variant="primary"
            fullWidth
            rounded="pill"
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          >
            {t('addresses.save')}
          </Button>
        </View>

        <Typography variant="caption" color="muted" className="text-center">
          ViaCEP API · brasileirao
        </Typography>
      </ScrollView>
    </ScreenWrapper>
  )
}
