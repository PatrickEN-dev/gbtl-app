// app/(tabs)/profile.tsx
import React from 'react'
import { View, TouchableOpacity, ScrollView } from 'react-native'
import Animated from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import { ChevronRight, LogOut } from 'lucide-react-native'
import ScreenWrapper from '@/components/layout/ScreenWrapper'
import Header from '@/components/layout/Header'
import Typography from '@/components/ui/Typography'
import Button from '@/components/ui/Button'
import Divider from '@/components/ui/Divider'
import { useScaleIn } from '@/lib/animations'
import { useAuth } from '@/hooks/useAuth'
import { Colors } from '@/constants/tokens'

function getInitials(name: string): string {
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase()
}

function MenuRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4 border-b border-border"
    >
      <Typography variant="body">{label}</Typography>
      <ChevronRight size={18} color={Colors.muted} />
    </TouchableOpacity>
  )
}

export default function ProfileScreen() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const { animatedStyle } = useScaleIn()

  const handleLogout = async () => {
    await logout()
    router.replace('/(tabs)')
  }

  return (
    <ScreenWrapper header={<Header title="Profile" />}>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {!isAuthenticated ? (
          <Animated.View
            style={animatedStyle}
            className="items-center justify-center pt-20 gap-4"
          >
            <Typography variant="heading2">Welcome</Typography>
            <Typography variant="body" color="muted" className="text-center">
              Sign in to access your orders and wishlist
            </Typography>
            <View className="w-full mt-4">
              <Button
                variant="primary"
                fullWidth
                onPress={() => router.push('/(auth)/login')}
              >
                Sign In
              </Button>
            </View>
          </Animated.View>
        ) : (
          <>
            <Animated.View
              style={animatedStyle}
              className="items-center pt-8 pb-6 gap-3"
            >
              <View className="w-16 h-16 rounded-full bg-accent items-center justify-center">
                <Typography variant="heading2" color="white">
                  {getInitials(user!.name)}
                </Typography>
              </View>
              <Typography variant="heading2">{user!.name}</Typography>
              <Typography variant="body-sm" color="muted">
                {user!.email}
              </Typography>
            </Animated.View>
            <Divider />
            <View className="py-2">
              <MenuRow label="Orders" onPress={() => {}} />
              <MenuRow label="Wishlist" onPress={() => {}} />
              <MenuRow label="Settings" onPress={() => {}} />
            </View>
            <Divider />
            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center gap-2 py-4"
            >
              <LogOut size={18} color={Colors.accent} />
              <Typography variant="body" color="accent">
                Logout
              </Typography>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </ScreenWrapper>
  )
}
