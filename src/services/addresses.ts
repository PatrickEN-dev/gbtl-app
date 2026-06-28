import { logger } from '@/lib/logger'
import { viaCepResponseSchema } from '@/schemas/product.schema'

export interface ViaCepResult {
  zip: string
  street: string
  neighborhood: string
  city: string
  state: string
  country: 'BR'
}

export function normalizeZip(input: string): string {
  return input.replace(/\D/g, '').slice(0, 8)
}

export function formatZip(zip: string): string {
  const digits = normalizeZip(zip)
  if (digits.length !== 8) return zip
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export async function lookupZip(rawZip: string): Promise<ViaCepResult | null> {
  const zip = normalizeZip(rawZip)
  if (zip.length !== 8) return null

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8_000)

  try {
    const res = await fetch(`https://viacep.com.br/ws/${zip}/json/`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return null

    const raw: unknown = await res.json()
    const parsed = viaCepResponseSchema.safeParse(raw)
    if (!parsed.success) {
      logger.warn('viacep.invalid_response')
      return null
    }
    const data = parsed.data
    if (data.erro || !data.localidade || !data.uf) return null

    return {
      zip: formatZip(zip),
      street: (data.logradouro ?? '').slice(0, 120),
      neighborhood: (data.bairro ?? '').slice(0, 80),
      city: data.localidade.slice(0, 80),
      state: data.uf.slice(0, 2).toUpperCase(),
      country: 'BR',
    }
  } catch (e) {
    if (e instanceof Error && e.name !== 'AbortError') {
      logger.warn('viacep.lookup_failed', { zip })
    }
    return null
  } finally {
    clearTimeout(timeout)
  }
}
