import { env, isMockValue, isProd } from '@/lib/env'
import { bindSentry } from '@/lib/logger'

let initialized = false

interface SentryShim {
  init: (opts: Record<string, unknown>) => void
  captureException: (e: unknown, ctx?: Record<string, unknown>) => void
  captureMessage: (msg: string, level?: 'info' | 'warning') => void
  setUser: (u: { id: string; email?: string } | null) => void
}

let Sentry: SentryShim | null = null

async function loadSentry(): Promise<SentryShim | null> {
  try {
    // eslint-disable-next-line import/no-unresolved
    const mod = (await import('@sentry/react-native')) as unknown as SentryShim
    if (mod && typeof mod.init === 'function') return mod
  } catch {
    // Sentry not installed yet; fall back to noop.
  }
  return null
}

// PII patterns: emails, CPF, CNPJ, cartões, IPs
const PII_PATTERNS: { rx: RegExp; replace: string }[] = [
  { rx: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replace: '[email]' },
  { rx: /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, replace: '[cpf]' }, // CPF
  { rx: /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g, replace: '[cnpj]' }, // CNPJ
  { rx: /\b(?:\d[ -]?){13,19}\b/g, replace: '[card]' }, // cartões
  { rx: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, replace: '[ip]' },
]

function scrubPII(input: string): string {
  let out = input
  for (const { rx, replace } of PII_PATTERNS) {
    out = out.replace(rx, replace)
  }
  return out
}

function scrubObject(obj: unknown, depth = 0): unknown {
  if (depth > 4) return '[truncated]'
  if (obj == null) return obj
  if (typeof obj === 'string') return scrubPII(obj)
  if (typeof obj === 'number' || typeof obj === 'boolean') return obj
  if (Array.isArray(obj)) return obj.slice(0, 50).map((v) => scrubObject(v, depth + 1))
  if (typeof obj === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (/password|token|secret|authorization|cookie|cpf|cnpj|card/i.test(k)) {
        out[k] = '[redacted]'
      } else {
        out[k] = scrubObject(v, depth + 1)
      }
    }
    return out
  }
  return '[unknown]'
}

export async function initMonitoring(): Promise<void> {
  if (initialized) return
  initialized = true

  if (isMockValue(env.sentryDsn)) {
    return
  }

  Sentry = await loadSentry()
  if (!Sentry) return

  Sentry.init({
    dsn: env.sentryDsn,
    environment: env.sentryEnv,
    enableAutoSessionTracking: true,
    tracesSampleRate: isProd ? 0.2 : 1.0,
    sendDefaultPii: false,
    beforeSend(event: Record<string, unknown>) {
      // Remove IP/user agent details
      const e = event as {
        user?: { id?: string; ip_address?: string; email?: string }
        request?: { cookies?: unknown; headers?: Record<string, unknown> }
        extra?: unknown
        contexts?: unknown
        message?: string
        exception?: unknown
      }
      if (e.user) {
        delete e.user.ip_address
        // Manter só ID + email truncado
        if (e.user.email) {
          const [local, domain] = e.user.email.split('@')
          e.user.email = local ? `${local.slice(0, 2)}***@${domain ?? ''}` : '[email]'
        }
      }
      if (e.request) {
        delete e.request.cookies
        if (e.request.headers) {
          delete e.request.headers['authorization']
          delete e.request.headers['cookie']
        }
      }
      e.extra = scrubObject(e.extra)
      if (typeof e.message === 'string') {
        e.message = scrubPII(e.message)
      }
      return event
    },
  })

  bindSentry({
    captureException: (e, ctx) =>
      Sentry?.captureException(e, { extra: scrubObject(ctx) as Record<string, unknown> }),
    captureMessage: (msg, level) => Sentry?.captureMessage(scrubPII(msg), level),
  })
}

export function identifyUser(user: { id: string; email?: string } | null) {
  if (!user) {
    Sentry?.setUser(null)
    return
  }
  // Não envia email completo
  const sanitized = user.email
    ? { id: user.id, email: user.email.split('@')[0] + '@***' }
    : { id: user.id }
  Sentry?.setUser(sanitized)
}
