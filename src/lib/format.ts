import i18n from '@/lib/i18n'

export function formatCurrency(value: number, currency = 'BRL'): string {
  const locale = i18n.language === 'pt-BR' ? 'pt-BR' : 'en-US'
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value)
  } catch {
    return `R$ ${value.toFixed(2)}`
  }
}

export function formatDate(timestamp: number, opts?: Intl.DateTimeFormatOptions): string {
  const locale = i18n.language === 'pt-BR' ? 'pt-BR' : 'en-US'
  try {
    return new Intl.DateTimeFormat(locale, opts ?? { dateStyle: 'medium' }).format(
      new Date(timestamp),
    )
  } catch {
    return new Date(timestamp).toLocaleDateString()
  }
}

export function formatOrderId(id: string): string {
  return id.replace(/^ord_/, '').toUpperCase().slice(-10)
}
