export interface Transaction {
  id: string
  amount: number
  currency: string
  status: 'succeeded' | 'pending' | 'failed' | 'refunded'
  payment_method: string
  payment_details: {
    last4?: string
    billing_address?: {
      line1: string
      city: string
      country: string
    }
  }
  refund_details?: {
    date: string
    reason: string
  }
  client: {
    full_name: string
    email: string
  }
  expert: {
    full_name: string
    email: string
  }
  booking_id: string
  created_at: string
}

export interface TransactionStats {
  totalAmount: number
  totalCount: number
  successRate: number
  dailyVolume: Array<{
    date: string
    amount: number
    count: number
  }>
}