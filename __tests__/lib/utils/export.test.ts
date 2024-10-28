import { exportTransactions } from '@/lib/utils/export'
import { formatDateTime, formatPrice } from '@/lib/utils'

describe('exportTransactions', () => {
  const mockTransactions = [
    {
      id: 'txn_1',
      created_at: '2023-12-25T12:00:00Z',
      amount: 10000,
      currency: 'USD',
      status: 'succeeded',
      client: { full_name: 'John Doe' },
      expert: { full_name: 'Jane Expert' },
      payment_method: 'card',
    },
  ]

  beforeEach(() => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = jest.fn()
    global.URL.revokeObjectURL = jest.fn()

    // Mock document.createElement and related methods
    document.createElement = jest.fn().mockReturnValue({
      click: jest.fn(),
      download: '',
      href: '',
    })
    document.body.appendChild = jest.fn()
    document.body.removeChild = jest.fn()
  })

  it('exports transactions to CSV', async () => {
    await exportTransactions(mockTransactions, 'csv')

    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(URL.createObjectURL).toHaveBeenCalled()
    expect(document.body.appendChild).toHaveBeenCalled()
    expect(document.body.removeChild).toHaveBeenCalled()
  })

  it('formats CSV data correctly', async () => {
    const blob = await exportTransactions(mockTransactions, 'csv')
    const csvContent = await new Response(blob).text()

    expect(csvContent).toContain('Transaction ID,Date,Amount,Currency')
    expect(csvContent).toContain('txn_1')
    expect(csvContent).toContain('John Doe')
    expect(csvContent).toContain('Jane Expert')
  })

  it('handles empty transaction list', async () => {
    await exportTransactions([], 'csv')

    expect(URL.createObjectURL).toHaveBeenCalledWith(
      expect.any(Blob)
    )
  })
})