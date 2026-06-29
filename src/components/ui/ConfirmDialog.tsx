import React from 'react'
import { Modal, Pressable, View } from 'react-native'
import { useColorScheme } from 'nativewind'
import Typography from './Typography'
import Button from './Button'
import { useConfirmStore } from '@/store/confirmStore'
import { useTranslation } from '@/lib/i18n'

export default function ConfirmDialog() {
  const open = useConfirmStore((s) => s.open)
  const title = useConfirmStore((s) => s.title)
  const message = useConfirmStore((s) => s.message)
  const confirmLabel = useConfirmStore((s) => s.confirmLabel)
  const cancelLabel = useConfirmStore((s) => s.cancelLabel)
  const destructive = useConfirmStore((s) => s.destructive)
  const resolve = useConfirmStore((s) => s.resolve)
  const { t } = useTranslation()
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'

  const surfaceBg = isDark ? 'rgb(37, 42, 38)' : 'rgb(255, 255, 255)'
  const destructiveColor = 'rgb(176, 60, 60)'

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => resolve(false)}
      statusBarTranslucent
    >
      <Pressable
        onPress={() => resolve(false)}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.55)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <View
          onStartShouldSetResponder={() => true}
          style={{
            backgroundColor: surfaceBg,
            borderRadius: 18,
            paddingVertical: 24,
            paddingHorizontal: 20,
            width: '100%',
            maxWidth: 360,
            shadowColor: 'rgb(0,0,0)',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 24,
            elevation: 12,
          }}
        >
          <Typography variant="heading3" className="text-center">
            {title}
          </Typography>
          {message ? (
            <Typography variant="body-sm" color="muted" className="text-center mt-2">
              {message}
            </Typography>
          ) : null}
          <View className="flex-row gap-3 mt-6">
            <View className="flex-1">
              <Button variant="outline" fullWidth onPress={() => resolve(false)}>
                {cancelLabel ?? t('common.cancel')}
              </Button>
            </View>
            <View className="flex-1">
              <Pressable
                onPress={() => resolve(true)}
                style={{
                  height: 48,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: destructive ? destructiveColor : 'rgb(92, 124, 95)',
                  shadowColor: destructive ? destructiveColor : 'rgb(92, 124, 95)',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                }}
              >
                <Typography variant="body" weight="semibold" color="white">
                  {confirmLabel ?? t('common.save')}
                </Typography>
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  )
}
