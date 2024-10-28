'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TransactionTable } from '@/components/admin/payments/transaction-table'
import { TransactionFilters } from '@/components/admin/payments/transaction-filters'
import { TransactionStats } from '@/components/admin/payments/transaction-stats'
import { TransactionDetailsModal } from '@/components/admin/payments/transaction-details-modal'
import { adminService } from '@/lib/api/admin-service'
import { type Transaction } from '@/types/payments'
import { exportTransactions } from '@/lib/utils/export'

export default function PaymentManagementPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: '7d',
    search: '',
  })

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => adminService.getTransactions(filters),
  })

  const { data: stats } = useQuery({
    queryKey: ['transaction-stats', filters.dateRange],
    queryFn: () => adminService.getTransactionStats(filters.dateRange),
  })

  const handleExport = async (format: 'csv' | 'pdf') => {
    if (!transactions) return
    await exportTransactions(transactions, format)
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Payment Transactions</h1>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
          >
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {stats && <TransactionStats stats={stats} />}

      <Card className="mt-8">
        <TransactionFilters
          value={filters}
          onChange={setFilters}
        />

        <TransactionTable
          transactions={transactions}
          isLoading={isLoading}
          onViewDetails={setSelectedTransaction}
        />
      </Card>

      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  )
}