// src/components/forms/Field/index.tsx
import React, { createContext, useContext, useState } from 'react'
import { TextInput, View, TextInputProps } from 'react-native'
import { Controller, Control, FieldValues, Path, RegisterOptions } from 'react-hook-form'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import Typography from '@/components/ui/Typography'
import { useThemeColors } from '@/hooks/useThemeColors'
import { Duration } from '@/lib/animations'

// ─── Context ─────────────────────────────────────────────────────────────────

interface FieldContextValue {
  value: string
  onChange: (text: string) => void
  onBlur: () => void
  error?: string
}

const FieldContext = createContext<FieldContextValue | null>(null)

function useFieldContext() {
  const ctx = useContext(FieldContext)
  if (!ctx) throw new Error('Field sub-components must be used inside Field.Root')
  return ctx
}

// ─── Field.Root ──────────────────────────────────────────────────────────────

interface RootProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  rules?: RegisterOptions<T>
  children: React.ReactNode
}

function Root<T extends FieldValues>({ control, name, rules, children }: RootProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <FieldContext.Provider
          value={{ value: value ?? '', onChange, onBlur, error: error?.message }}
        >
          <View className="mb-4">
            {children}
          </View>
        </FieldContext.Provider>
      )}
    />
  )
}

// ─── Field.Label ─────────────────────────────────────────────────────────────

interface LabelProps {
  children: React.ReactNode
}

function Label({ children }: LabelProps) {
  return (
    <Typography variant="body-sm" color="primary" className="mb-1 font-medium">
      {children}
    </Typography>
  )
}

// ─── Field.Input ─────────────────────────────────────────────────────────────

type InputProps = Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'>

function Input({ className = '', style, ...rest }: InputProps) {
  const { value, onChange, onBlur, error } = useFieldContext()
  const [focused, setFocused] = useState(false)
  const colors = useThemeColors()

  const borderClass = error
    ? 'border-red-500'
    : focused
    ? 'border-accent'
    : 'border-border'

  const containerClass = [
    'h-12 px-4 rounded-lg border bg-surface',
    borderClass,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <TextInput
      className={containerClass}
      value={value}
      onChangeText={onChange}
      onBlur={() => {
        setFocused(false)
        onBlur()
      }}
      onFocus={() => setFocused(true)}
      placeholderTextColor={colors.muted}
      style={[{ fontSize: 15, color: colors.primary }, style]}
      {...rest}
    />
  )
}

// ─── Field.Error ─────────────────────────────────────────────────────────────

function FieldError() {
  const { error } = useFieldContext()

  const heightValue = useSharedValue(0)
  const opacityValue = useSharedValue(0)

  const hasError = Boolean(error)

  React.useEffect(() => {
    if (hasError) {
      heightValue.value = withTiming(20, { duration: Duration.fast })
      opacityValue.value = withTiming(1, { duration: Duration.fast })
    } else {
      heightValue.value = withTiming(0, { duration: Duration.fast })
      opacityValue.value = withTiming(0, { duration: Duration.fast })
    }
  }, [hasError])

  const animatedStyle = useAnimatedStyle(() => ({
    height: heightValue.value,
    opacity: opacityValue.value,
  }))

  return (
    <Animated.View style={[animatedStyle, { overflow: 'hidden' }]} className="mt-1">
      {error ? (
        <Typography variant="caption" color="accent">
          {error}
        </Typography>
      ) : null}
    </Animated.View>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const Field = {
  Root,
  Label,
  Input,
  Error: FieldError,
}
