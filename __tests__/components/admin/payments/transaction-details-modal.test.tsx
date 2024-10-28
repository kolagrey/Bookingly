import { render, screen } from '@testing-library/react'
import { TransactionDetailsModal } from '@/components/admin/payments/transaction-details-modal'

describe('TransactionDetailsModal', () => {
  const mockTransaction = {
    id: 'txn_1',
    created_at: '2023-12-25T12:00:00Z',
    amount: 10000,
    currency: 'USD',
    status: 'succeeded',
    payment_method: 'card',
    payment_details: {
      last4: '4242',
      billing_address: {
        line1: '123 Main St',
        city: 'New York',
        country: 'US',
      },
    },
    client: {
      full_name: 'John Doe',
      email: 'john@example.com',
    },
    expert: {
      full_name: 'Jane Expert',
      email: 'jane@example.com',
    },
  }

  it('renders transaction details correctly', () => {
    render(
      <TransactionDetailsModal
        transaction={mockTransaction}
        onClose={() => {}}
      />
    )

    expect(screen.getByText('Transaction Details')).toBeInTheDocument()
    expect(screen.getByText('txn_1')).toBeInTheDocument()
    expect(screen.getByText('$100.00')).toBeInTheDocument()
    expect(screen.getByText('****4242')).toBeInTheDocument()
    expect(screen.getByText('123 Main St')).toBeInTheDocument()
  })

  it('displays refund details when available', () => {
    const refundedTransaction = {
      ...mockTransaction,
      refund_details: {
        date: '2023-12-26T12:00:00Z',
        reason: 'Customer requested',
      },
    }

    render(
      <TransactionDetailsModal
        transaction={refundedTransaction}
        onClose={() => {}}
      />
    )

    expect(screen.getByText('Refund Details')).toBeInTheDocument()
    expect(screen.getByText('Customer requested')).toBeInTheDocument()
  })
})