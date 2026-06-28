import { useStripe } from '@stripe/stripe-react-native'
import { env, isMockValue } from '@/lib/env'
import { logger } from '@/lib/logger'
import { track } from '@/lib/analytics'
import { stripeIntentResponseSchema } from '@/schemas/product.schema'

export interface CheckoutParams {
  amount: number
  currency?: string
  customerEmail?: string
  description?: string
  metadata?: Record<string, string>
}

export interface CheckoutResult {
  ok: boolean
  paymentIntentId?: string
  error?: string
  canceled?: boolean
}

export function useStripeCheckout() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe()

  async function checkout({
    amount,
    currency = 'brl',
    customerEmail,
    description,
    metadata,
  }: CheckoutParams): Promise<CheckoutResult> {
    // Defesa: amount mínimo (R$ 1) e máximo (R$ 100k) para evitar abuso
    if (!Number.isFinite(amount) || amount < 1 || amount > 100_000) {
      return { ok: false, error: 'Valor inválido' }
    }
    if (!/^[a-z]{3}$/.test(currency)) {
      return { ok: false, error: 'Moeda inválida' }
    }
    // Endpoint só pode ser HTTPS (exceto loopback dev)
    const endpoint = env.stripePaymentEndpoint
    if (
      !endpoint.startsWith('https://') &&
      !/^https?:\/\/(localhost|127\.0\.0\.1|10\.0\.2\.2)/.test(endpoint)
    ) {
      return { ok: false, error: 'Endpoint inseguro (HTTPS obrigatório)' }
    }
    if (isMockValue(endpoint)) {
      logger.warn('stripe.endpoint_not_configured')
      return {
        ok: false,
        error:
          'Stripe não configurado. Configure EXPO_PUBLIC_STRIPE_PAYMENT_ENDPOINT e deploye o backend (ver SETUP.md).',
      }
    }
    if (isMockValue(env.stripePublishableKey)) {
      return {
        ok: false,
        error:
          'Stripe Publishable Key não configurada. Defina EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY.',
      }
    }

    track('checkout_started', { amount, currency, items: metadata?.itemCount ?? null })

    let clientSecret: string
    let ephemeralKey: string | undefined
    let customer: string | undefined
    let paymentIntentId: string | undefined

    // Sanitize metadata: only string→string entries, max 50 keys
    const safeMetadata: Record<string, string> = {}
    if (metadata) {
      const entries = Object.entries(metadata).slice(0, 50)
      for (const [k, v] of entries) {
        if (typeof k === 'string' && typeof v === 'string') {
          safeMetadata[k.slice(0, 40)] = v.slice(0, 500)
        }
      }
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20_000)

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'omit',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Requested-With': 'GBTL-Mobile',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency,
          email: customerEmail?.slice(0, 320),
          description: description?.slice(0, 200),
          metadata: safeMetadata,
        }),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        const error = `Backend ${res.status}: ${text || res.statusText}`
        logger.warn('stripe.endpoint_error', { status: res.status })
        track('checkout_failed', { reason: 'endpoint_error', status: res.status })
        return { ok: false, error }
      }

      const raw: unknown = await res.json()
      const parsed = stripeIntentResponseSchema.safeParse(raw)
      if (!parsed.success) {
        logger.warn('stripe.invalid_response')
        track('checkout_failed', { reason: 'invalid_response' })
        return { ok: false, error: 'Resposta inválida do backend' }
      }
      clientSecret = parsed.data.clientSecret
      ephemeralKey = parsed.data.ephemeralKey
      customer = parsed.data.customer
      paymentIntentId = parsed.data.paymentIntentId
    } catch (e) {
      logger.error(e, { op: 'stripe.fetch_intent' })
      track('checkout_failed', { reason: 'network' })
      return { ok: false, error: 'Falha de rede ao iniciar pagamento' }
    } finally {
      clearTimeout(timeout)
    }

    const initResult = await initPaymentSheet({
      merchantDisplayName: 'GBTL',
      paymentIntentClientSecret: clientSecret,
      customerEphemeralKeySecret: ephemeralKey,
      customerId: customer,
      defaultBillingDetails: customerEmail ? { email: customerEmail } : undefined,
      applePay: { merchantCountryCode: 'BR' },
      googlePay: {
        merchantCountryCode: 'BR',
        currencyCode: currency.toUpperCase(),
        testEnv: __DEV__,
      },
    })

    if (initResult.error) {
      logger.warn('stripe.init_error', { code: initResult.error.code })
      track('checkout_failed', { reason: 'init', code: initResult.error.code })
      return { ok: false, error: initResult.error.message }
    }

    const presentResult = await presentPaymentSheet()
    if (presentResult.error) {
      if (presentResult.error.code === 'Canceled') {
        track('checkout_failed', { reason: 'canceled' })
        return { ok: false, canceled: true }
      }
      logger.warn('stripe.present_error', { code: presentResult.error.code })
      track('checkout_failed', { reason: 'present', code: presentResult.error.code })
      return { ok: false, error: presentResult.error.message }
    }

    track('checkout_completed', { amount, currency })
    return { ok: true, paymentIntentId }
  }

  return { checkout }
}
