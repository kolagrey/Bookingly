'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { adminService } from '@/lib/api/admin-service'
import { useToast } from '@/components/ui/use-toast'
import { formatDateTime, formatPrice } from '@/lib/utils'
import { type Transaction } from '@/types/payments'

interface TransactionTableProps {
  transactions?: Transaction[]
  isLoading: boolean
  onViewDetails: (transaction: Transaction) => void
}

export function TransactionTable({
  transactions,
  isLoading,
  onViewDetails,
}: TransactionTableProps) {
  const [actionTransaction, setActionTransaction] = useState<{
    transaction: Transaction
    action: 'refund' | 'void' | 'capture'
  } | null>(null)
  const { toast } = useToast()

  const handleAction = async () => {
    if (!actionTransaction) return

    try {
      const { transaction, action } = actionTransaction
      await adminService.processTransaction(transaction.id, action)
      
      toast({
        title: 'Success',
        description: `Transaction ${action}ed successfully.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${actionTransaction.action} transaction.`,
        variant: 'destructive',
      })
    } finally {
      setActionTransaction(null)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Expert</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {formatDateTime(transaction.created_at)}
              </TableCell>
              <TableCell className="font-mono">
                {transaction.id.slice(0, 8)}
              </TableCell>
              <TableCell>{transaction.client.full_name}</TableCell>
              <TableCell>{transaction.expert.full_name}</TableCell>
              <TableCell>
                {formatPrice(transaction.amount, transaction.currency)}
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  transaction.status === 'succeeded'
                    ? 'bg-green-100 text-green-800'
                    : transaction.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {transaction.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(transaction)}
                  >
                    View
                  </Button>
                  {transaction.status === 'succeeded' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActionTransaction({
                        transaction,
                        action: 'refund',
                      })}
                    >
                      Refund
                    </Button>
                  )}
                  {transaction.status === 'pending' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActionTransaction({
                          transaction,
                          action: 'capture',
                        })}
                      >
                        Capture
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActionTransaction({
                          transaction,
                          action: 'void',
                        })}
                      >
                        Void
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog
        open={!!actionTransaction}
        onOpenChange={() => setActionTransaction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirm {actionTransaction?.action}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionTransaction?.action} this transaction?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}