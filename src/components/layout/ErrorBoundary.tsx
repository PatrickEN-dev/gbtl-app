import React from 'react'
import { View } from 'react-native'
import Typography from '@/components/ui/Typography'
import Button from '@/components/ui/Button'
import { logger } from '@/lib/logger'
import { isProd } from '@/lib/env'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  errorMessage?: string
}

class ErrorBoundary extends React.Component<Props, State> {
  override state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      // Em produção nunca expomos a mensagem real (pode vazar info)
      errorMessage: isProd ? undefined : error.message,
    }
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo): void {
    logger.error(error, {
      op: 'error_boundary',
      componentStack: isProd ? undefined : info.componentStack,
    })
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: undefined })
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <View className="flex-1 items-center justify-center bg-bg px-6">
          <Typography variant="heading3" className="text-center mb-2">
            Algo deu errado
          </Typography>
          {this.state.errorMessage ? (
            <Typography variant="body-sm" color="muted" className="text-center mb-4">
              {this.state.errorMessage}
            </Typography>
          ) : (
            <Typography variant="body-sm" color="muted" className="text-center mb-4">
              Tente novamente em alguns instantes.
            </Typography>
          )}
          <Button variant="outline" onPress={this.handleReset}>
            Tentar de novo
          </Button>
        </View>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
