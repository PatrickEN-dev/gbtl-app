import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useRouter } from 'expo-router'
import { useCartUI } from '@/store/cartUIStore'

export default function CartTabScreen() {
  const router = useRouter()
  const openCart = useCartUI((s) => s.open)

  useEffect(() => {
    openCart()
    router.replace('/(tabs)')
  }, [openCart, router])

  return <View className="flex-1 bg-bg" />
}
