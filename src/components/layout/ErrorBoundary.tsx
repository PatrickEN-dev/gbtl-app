
import React from 'react'
import { View } from 'react-native'
import Typography from '@/components/ui/Typography'
import Button from '@/components/ui/Button'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('[ErrorBoundary] Caught error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center bg-bg px-6">
          <Typography variant="heading3" className="text-center mb-4">
            Something went wrong
          </Typography>
          <Button
            variant="outline"
            onPress={() => this.setState({ hasError: false })}
          >
            Try again
          </Button>
        </View>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
