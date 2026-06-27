
import { router } from 'expo-router'
import { AlertCircle } from 'lucide-react-native'
import ScreenWrapper from '@/components/layout/ScreenWrapper'
import EmptyState from '@/components/ui/EmptyState'

export default function NotFound() {
  return (
    <ScreenWrapper>
      <EmptyState
        icon={AlertCircle}
        title="Page not found"
        description="The page you are looking for does not exist."
        action={{
          label: 'Go Home',
          onPress: () => router.replace('/(tabs)'),
        }}
      />
    </ScreenWrapper>
  )
}
