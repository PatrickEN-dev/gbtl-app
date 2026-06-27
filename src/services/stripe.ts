// src/services/stripe.ts
// Native Stripe Payment Sheet (no UI of ours — Stripe owns the checkout view).
//
// Requires a tiny backend endpoint (5 lines of code in Vercel/Firebase Functions)
// that creates a PaymentIntent with your Stripe SECRET key and returns the clientSecret.
// See SETUP.md for the template.
import { useStripe } from '@stripe/stripe-react-native'
import Constants from 'expo-constants'

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string>

export interface CheckoutParams {
  amount: number          // in dollars (e.g. 215.0)
  currency?: string       // default 'usd'
  customerEmail?: string
  description?: string
}

export interface CheckoutResult {
  ok: boolean
  error?: string
}

export function useStripeCheckout() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe()

  async function checkout({
    amount,
    currency = 'usd',
    customerEmail,
    description,
  }: CheckoutParams): Promise<CheckoutResult> {
    const endpoint = extra.stripePaymentEndpoint
    if (!endpoint || endpoint.startsWith('PLACEHOLDER')) {
      return { ok: false, error: 'Stripe endpoint not configured. See SETUP.md.' }
    }

    // 1. Ask backend to create a PaymentIntent
    let clientSecret: string
    let ephemeralKey: string | undefined
    let customer: string | undefined
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Stripe uses cents
          currency,
          email: customerEmail,
          description,
        }),
      })
      if (!res.ok) {
        const text = await res.text()
        return { ok: false, error: `Backend ${res.status}: ${text}` }
      }
      const json = (await res.json()) as {
        clientSecret: string
        ephemeralKey?: string
        customer?: string
      }
      clientSecret = json.clientSecret
      ephemeralKey = json.ephemeralKey
      customer = json.customer
    } catch (e) {
      return { ok: false, error: (e as Error).message }
    }

    // 2. Initialize the Payment Sheet with the clientSecret
    const initResult = await initPaymentSheet({
      merchantDisplayName: 'GBTL',
      paymentIntentClientSecret: clientSecret,
      customerEphemeralKeySecret: ephemeralKey,
      customerId: customer,
      defaultBillingDetails: customerEmail ? { email: customerEmail } : undefined,
      // Apple Pay
      applePay: { merchantCountryCode: 'US' },
      // Google Pay
      googlePay: {
        merchantCountryCode: 'US',
        currencyCode: currency.toUpperCase(),
        testEnv: __DEV__,
      },
    })
    if (initResult.error) {
      return { ok: false, error: initResult.error.message }
    }

    // 3. Present the Stripe-hosted sheet
    const presentResult = await presentPaymentSheet()
    if (presentResult.error) {
      // user-cancelled is not an error worth surfacing
      if (presentResult.error.code === 'Canceled') return { ok: false }
      return { ok: false, error: presentResult.error.message }
    }

    return { ok: true }
  }

  return { checkout }
}
