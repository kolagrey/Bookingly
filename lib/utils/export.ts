import { type Transaction } from '@/types/payments'
import { formatDateTime, formatPrice } from '@/lib/utils'

export async function exportTransactions(
  transactions: Transaction[],
  format: 'csv' | 'pdf'
) {
  if (format === 'csv') {
    const headers = [
      'Transaction ID',
      'Date',
      'Amount',
      'Currency',
      'Status',
      'Client',
      'Expert',
      'Payment Method',
    ]

    const rows = transactions.map((t) => [
      t.id,
      formatDateTime(t.created_at),
      t.amount,
      t.currency,
      t.status,
      t.client.full_name,
      t.expert.full_name,
      t.payment_method,
    ])

    const csv = [
      headers.join(','),
      ...rows.map((r) => r.join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `transactions-${formatDateTime(new Date())}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } else {
    // TODO: Implement PDF export using a library like jsPDF
    console.log('PDF export not implemented yet')
  }
}