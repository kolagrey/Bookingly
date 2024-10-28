const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) return amount

  // Use exchange rate API (implement your preferred provider)
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_EXCHANGE_RATE_API}/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`
  )
  const data = await response.json()
  return data.result
}