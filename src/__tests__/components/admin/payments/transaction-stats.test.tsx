import { render, screen } from '@testing-library/react'
import { TransactionStats } from '@/components/admin/payments/transaction-stats'

describe('TransactionStats', () => {
  const mockStats = {
    totalAmount: 100000,
    totalCount: 50,
    successRate: 95.5,
    dailyVolume: [
      { date: '2023-12-24', amount: 50000, count: 25 },
      { date: '2023-12-25', amount: 50000, count: 25 },
    ],
  }

  it('renders stats correctly', () => {
    render(<TransactionStats stats={mockStats} />)

    expect(screen.getByText('$1,000.00')).toBeInTheDocument()
    expect(screen.getByText('50 transactions')).toBeInTheDocument()
    expect(screen.getByText('95.5%')).toBeInTheDocument()
  })

  it('calculates daily average correctly', () => {
    render(<TransactionStats stats={mockStats} />)

    expect(screen.getByText('$500.00')).toBeInTheDocument()
    expect(screen.getByText('25.0 transactions/day')).toBeInTheDocument()
  })
})