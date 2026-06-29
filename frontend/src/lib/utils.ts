export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatCurrency(amount: number): string {
  return `S/ ${amount.toFixed(2)}`
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })
}
