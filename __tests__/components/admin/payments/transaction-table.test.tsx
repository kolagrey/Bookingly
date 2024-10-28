import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TransactionTable } from '@/components/admin/payments/transaction-table'
import { adminService } from '@/lib/api/admin-service'

jest.mock('@/lib/api/admin-service')

describe('TransactionTable', () => {
  const mockTransactions = [
    {
      id: 'txn_1',
      created_at: '2023-12-25T12:00:00Z',
      amount: 10000,
      currency: 'USD',
      status: 'succeeded',
      client: { full_name: 'John Doe' },
      expert: { full_name: 'Jane Expert' },
    },
  ]

  const mockOnViewDetails = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders transactions correctly', () => {
    render(
      <TransactionTable
        transactions={mockTransactions}
        isLoading={false}
        onViewDetails={mockOnViewDetails}
      />
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Expert')).toBeInTheDocument()
    expect(screen.getByText('$100.00')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(
      <TransactionTable
        transactions={[]}
        isLoading={true}
        onViewDetails={mockOnViewDetails}
      />
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('handles refund action', async () => {
    ;(adminService.processTransaction as jest.Mock).mockResolvedValue({})

    render(
      <TransactionTable
        transactions={mockTransactions}
        isLoading={false}
        onViewDetails={mockOnViewDetails}
      />
    )

    fireEvent.click(screen.getByText('Refund'))
    fireEvent.click(screen.getByText('Confirm'))

    await waitFor(() => {
      expect(adminService.processTransaction).toHaveBeenCalledWith(
        'txn_1',
        'refund'
      )
    })
  })

  it('shows empty state when no transactions', () => {
    render(
      <TransactionTable
        transactions={[]}
        isLoading={false}
        onViewDetails={mockOnViewDetails}
      />
    )

    expect(screen.getByText('No transactions found')).toBeInTheDocument()
  })
})