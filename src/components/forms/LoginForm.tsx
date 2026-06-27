// src/components/forms/LoginForm.tsx
import React, { useState } from 'react'
import { View, Pressable, ScrollView } from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from 'expo-router'
import { loginSchema, type LoginFormData } from '@/schemas/login.schema'
import { useAuth } from '@/hooks/useAuth'
import { Field } from '@/components/forms/Field'
import Button from '@/components/ui/Button'
import Typography from '@/components/ui/Typography'

export default function LoginForm() {
  const { login } = useAuth()
  const [generalError, setGeneralError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginFormData) => {
    setGeneralError(null)
    try {
      await login(data.email, data.password)
      router.replace('/(tabs)')
    } catch {
      setError('email', { message: 'Invalid email or password' })
      setGeneralError('Invalid email or password. Please try again.')
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 px-6 pt-8 pb-6">
          {/* Title */}
          <View className="mb-8">
            <Typography variant="heading1" weight="bold" className="mb-2">
              Welcome back
            </Typography>
            <Typography variant="body" color="muted">
              Sign in to continue shopping
            </Typography>
          </View>

          {/* General error */}
          {generalError ? (
            <View className="mb-4 px-4 py-3 bg-red-50 rounded-lg border border-red-200">
              <Typography variant="body-sm" className="text-red-600">
                {generalError}
              </Typography>
            </View>
          ) : null}

          {/* Email field */}
          <Field.Root control={control} name="email">
            <Field.Label>Email address</Field.Label>
            <Field.Input
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="you@example.com"
              returnKeyType="next"
            />
            <Field.Error />
          </Field.Root>

          {/* Password field */}
          <Field.Root control={control} name="password">
            <Field.Label>Password</Field.Label>
            <Field.Input
              secureTextEntry
              placeholder="••••••••"
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSubmit)}
            />
            <Field.Error />
          </Field.Root>

          {/* Forgot password */}
          <View className="items-end mb-8">
            <Pressable onPress={() => {}}>
              <Typography variant="body-sm" color="accent">
                Forgot password?
              </Typography>
            </Pressable>
          </View>

          {/* Submit button */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          >
            Sign In
          </Button>
      </View>
    </ScrollView>
  )
}
