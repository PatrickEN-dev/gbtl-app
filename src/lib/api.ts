import { env } from '@/lib/env'
import { getToken } from '@/lib/secureStore'
import { logger } from '@/lib/logger'

export class ApiError extends Error {
  status: number
  body: string
  constructor(status: number, body: string, message?: string) {
    super(message ?? `API ${status}: ${body.slice(0, 200)}`)
    this.status = status
    this.body = body
    this.name = 'ApiError'
  }
}

interface RequestOptions extends Omit<RequestInit, 'body' | 'credentials'> {
  body?: unknown
  timeoutMs?: number
  skipAuth?: boolean
}

function assertSecureUrl(url: string): void {
  // Bloqueia URLs não-HTTPS exceto loopback dev
  if (
    !url.startsWith('https://') &&
    !/^https?:\/\/(localhost|127\.0\.0\.1|10\.0\.2\.2)/.test(url)
  ) {
    throw new Error('Insecure URL — HTTPS required')
  }
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${env.apiUrl}${path}`
  assertSecureUrl(url)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? 15_000)

  let authHeader: Record<string, string> = {}
  if (!opts.skipAuth) {
    const token = await getToken()
    if (token) authHeader = { Authorization: `Bearer ${token}` }
  }

  try {
    const res = await fetch(url, {
      ...opts,
      // credentials: 'omit' — não enviar cookies. Mobile não usa cookies de qualquer jeito,
      // mas explicitar protege caso o backend retorne Set-Cookie por engano.
      credentials: 'omit',
      // cache: 'no-store' — respostas autenticadas nunca devem ser cacheadas
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'GBTL-Mobile',
        ...authHeader,
        ...opts.headers,
      },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      const err = new ApiError(res.status, text)
      logger.warn('api.request.failed', { url, status: res.status })
      throw err
    }

    if (res.status === 204) return undefined as T

    const contentType = res.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      // Limita tamanho da resposta para evitar payload bomb
      const text = await res.text()
      if (text.length > 5_000_000) {
        throw new ApiError(res.status, '', 'Response too large')
      }
      try {
        return JSON.parse(text) as T
      } catch {
        throw new ApiError(res.status, text.slice(0, 200), 'Invalid JSON')
      }
    }
    return (await res.text()) as unknown as T
  } catch (e) {
    if (e instanceof ApiError) throw e
    if (e instanceof Error && e.name === 'AbortError') {
      throw new ApiError(0, 'timeout', 'Request timeout')
    }
    logger.error(e, { url, op: 'api.request' })
    throw e
  } finally {
    clearTimeout(timeout)
  }
}

export const api = {
  get: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, body: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: 'POST', body }),
  put: <T>(path: string, body: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: 'PUT', body }),
  patch: <T>(path: string, body: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: 'PATCH', body }),
  delete: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: 'DELETE' }),
}
