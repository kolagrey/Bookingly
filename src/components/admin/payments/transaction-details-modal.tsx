'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatDateTime, formatPrice } from '@/lib/utils'
import { type Transaction } from '@/types/payments'

interface TransactionDetailsModalProps {
  transaction: Transaction
  onClose: () => void
}

export function TransactionDetailsModal({
  transaction,
  onClose,
}: TransactionDetailsModalProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-1">Transaction ID</h3>
              <p className="font-mono">{transaction.id}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Date</h3>
              <p>{formatDateTime(transaction.created_at)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-1">Amount</h3>
              <p>{formatPrice(transaction.amount, transaction.currency)}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Status</h3>
              <p className="capitalize">{transaction.status}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-1">Client</h3>
              <p>{transaction.client.full_name}</p>
              <p className="text-sm text-muted-foreground">
                {transaction.client.email}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Expert</h3>
              <p>{transaction.expert.full_name}</p>
              <p className="text-sm text-muted-foreground">
                {transaction.expert.email}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Payment Method</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="capitalize">{transaction.payment_method}</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.payment_details.last4 &&
                    `****${transaction.payment_details.last4}`}
                </p>
              </div>
              {transaction.payment_details.billing_address && (
                <div>
                  <p className="text-sm">
                    {transaction.payment_details.billing_address.line1}
                  </p>
                  <p className="text-sm">
                    {transaction.payment_details.billing_address.city},{' '}
                    {transaction.payment_details.billing_address.country}
                  </p>
                </div>
              )}
            </div>
          </div>

          {transaction.refund_details && (
            <div>
              <h3 className="font-semibold mb-1">Refund Details</h3>
              <p>
                Refunded on{' '}
                {formatDateTime(transaction.refund_details.date)}
              </p>
              <p className="text-sm text-muted-foreground">
                {transaction.refund_details.reason}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}