import { rateLimit } from '@/lib/rateLimit'
import type { Coupon } from '@/types'

const MOCK_COUPONS: Record<string, Coupon> = {
  BEMVINDO10: {
    code: 'BEMVINDO10',
    type: 'percent',
    value: 10,
    description: '10% off no primeiro pedido',
  },
  FRETEGRATIS: {
    code: 'FRETEGRATIS',
    type: 'free_shipping',
    value: 0,
    minSubtotal: 100,
    description: 'Frete grátis em compras acima de R$ 100',
  },
  GBTL50: {
    code: 'GBTL50',
    type: 'fixed',
    value: 50,
    minSubtotal: 250,
    description: 'R$ 50 off em compras acima de R$ 250',
  },
}

function sanitizeCode(raw: string): string {
  // Apenas A-Z, 0-9, max 24 chars — protege contra abuso e SQLi-like patterns
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 24)
}

export async function validateCoupon(
  rawCode: string,
  subtotal: number,
): Promise<{ ok: true; coupon: Coupon } | { ok: false; reason: string }> {
  const code = sanitizeCode(rawCode)
  if (!code) return { ok: false, reason: 'Informe um código válido' }

  // Limite de 6 tentativas por minuto contra brute-force
  if (!rateLimit('coupon:validate', { perMinute: 6, burst: 6 })) {
    return { ok: false, reason: 'Muitas tentativas. Aguarde um momento.' }
  }

  const coupon = MOCK_COUPONS[code]
  if (!coupon) return { ok: false, reason: 'Cupom não encontrado' }

  if (coupon.expiresAt && coupon.expiresAt < Date.now()) {
    return { ok: false, reason: 'Cupom expirado' }
  }
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return {
      ok: false,
      reason: `Subtotal mínimo de R$ ${coupon.minSubtotal.toFixed(2)} para este cupom`,
    }
  }
  return { ok: true, coupon }
}

export function applyCouponMath(
  subtotal: number,
  shipping: number,
  coupon: Coupon | null,
): { discount: number; finalShipping: number } {
  if (!coupon) return { discount: 0, finalShipping: shipping }
  switch (coupon.type) {
    case 'percent':
      return {
        discount: Math.min(subtotal, (subtotal * coupon.value) / 100),
        finalShipping: shipping,
      }
    case 'fixed':
      return { discount: Math.min(subtotal, coupon.value), finalShipping: shipping }
    case 'free_shipping':
      return { discount: 0, finalShipping: 0 }
  }
}
