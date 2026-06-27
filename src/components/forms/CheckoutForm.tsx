
import React from 'react'
import { View } from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BottomSheetScrollView, useBottomSheetModal } from '@gorhom/bottom-sheet'
import { checkoutSchema, type CheckoutFormData } from '@/schemas/checkout.schema'
import { useCart } from '@/hooks/useCart'
import { Field } from '@/components/forms/Field'
import Button from '@/components/ui/Button'
import Typography from '@/components/ui/Typography'
import { Spacing } from '@/constants/tokens'

export default function CheckoutForm() {
  const { clearCart } = useCart()
  const { dismiss } = useBottomSheetModal()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      address: '',
      city: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    },
  })

  const onSubmit = async (_data: CheckoutFormData) => {
    clearCart()
    dismiss()
  }

  return (
    <BottomSheetScrollView contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl }}>

      <View className="mb-6 pt-4">
        <Typography variant="heading2" weight="bold">
          Checkout
        </Typography>
        <Typography variant="body-sm" color="muted" className="mt-1">
          Complete your purchase
        </Typography>
      </View>


      <View className="mb-2">
        <Typography variant="heading3" weight="semibold" className="mb-4">
          Personal Information
        </Typography>

        <Field.Root control={control} name="fullName">
          <Field.Label>Full name</Field.Label>
          <Field.Input
            placeholder="John Doe"
            autoCapitalize="words"
            returnKeyType="next"
          />
          <Field.Error />
        </Field.Root>

        <Field.Root control={control} name="address">
          <Field.Label>Address</Field.Label>
          <Field.Input
            placeholder="123 Main Street, Apt 4"
            autoCapitalize="words"
            returnKeyType="next"
          />
          <Field.Error />
        </Field.Root>

        <Field.Root control={control} name="city">
          <Field.Label>City</Field.Label>
          <Field.Input
            placeholder="New York"
            autoCapitalize="words"
            returnKeyType="next"
          />
          <Field.Error />
        </Field.Root>
      </View>


      <View className="mb-6">
        <Typography variant="heading3" weight="semibold" className="mb-4">
          Payment
        </Typography>

        <Field.Root control={control} name="cardNumber">
          <Field.Label>Card number</Field.Label>
          <Field.Input
            placeholder="1234567890123456"
            keyboardType="number-pad"
            maxLength={16}
            returnKeyType="next"
          />
          <Field.Error />
        </Field.Root>

        <View className="flex-row gap-4">
          <View className="flex-1">
            <Field.Root control={control} name="expiry">
              <Field.Label>Expiry</Field.Label>
              <Field.Input
                placeholder="MM/YY"
                keyboardType="number-pad"
                maxLength={5}
                returnKeyType="next"
              />
              <Field.Error />
            </Field.Root>
          </View>

          <View className="flex-1">
            <Field.Root control={control} name="cvv">
              <Field.Label>CVV</Field.Label>
              <Field.Input
                placeholder="123"
                keyboardType="number-pad"
                maxLength={3}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
              />
              <Field.Error />
            </Field.Root>
          </View>
        </View>
      </View>


      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      >
        Place Order
      </Button>
    </BottomSheetScrollView>
  )
}
