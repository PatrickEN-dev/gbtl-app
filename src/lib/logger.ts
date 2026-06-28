import { isDev } from '@/lib/env'

type Meta = Record<string, unknown>

interface Logger {
  debug: (msg: string, meta?: Meta) => void
  info: (msg: string, meta?: Meta) => void
  warn: (msg: string, meta?: Meta) => void
  error: (e: unknown, meta?: Meta) => void
}

let sentryCapture: ((e: unknown, ctx?: Meta) => void) | null = null
let sentryMessage: ((msg: string, level: 'warning' | 'info') => void) | null = null

export function bindSentry(handlers: {
  captureException: (e: unknown, ctx?: Meta) => void
  captureMessage: (msg: string, level: 'warning' | 'info') => void
}) {
  sentryCapture = handlers.captureException
  sentryMessage = handlers.captureMessage
}

function fmt(meta?: Meta) {
  if (!meta || Object.keys(meta).length === 0) return ''
  try {
    return ' ' + JSON.stringify(meta)
  } catch {
    return ''
  }
}

export const logger: Logger = {
  debug: (msg, meta) => {
    if (isDev) console.log(`[debug] ${msg}${fmt(meta)}`)
  },
  info: (msg, meta) => {
    if (isDev) console.log(`[info] ${msg}${fmt(meta)}`)
    sentryMessage?.(msg, 'info')
  },
  warn: (msg, meta) => {
    if (isDev) console.warn(`[warn] ${msg}${fmt(meta)}`)
    sentryMessage?.(msg, 'warning')
  },
  error: (e, meta) => {
    const err = e instanceof Error ? e : new Error(String(e))
    if (isDev) console.error(`[error] ${err.message}${fmt(meta)}`, err)
    sentryCapture?.(err, meta)
  },
}
