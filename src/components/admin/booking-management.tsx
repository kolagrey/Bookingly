'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { adminService } from '@/lib/api/admin-service'
import { bookingService } from '@/lib/api/booking-service'
import { formatDateTime, formatPrice } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import { type BookingStatus, type PaymentStatus } from '@/types/database'

export function BookingManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')
  const { toast } = useToast()

  const { data: bookings, refetch } = useQuery({
    queryKey: ['admin-bookings', searchTerm, statusFilter],
    queryFn: () => adminService.getBookings({ search: searchTerm, status: statusFilter }),
  })

  const updateStatusMutation = useMutation({
    mutationFn: async (params: { bookingId: string; status: BookingStatus }) => {
      const { error } = await bookingService.updateBookingStatus(
        params.bookingId,
        params.status
      )
      if (error) throw error
    },
    onSuccess: () => {
      toast({
        title: 'Booking updated',
        description: 'The booking status has been updated and notifications sent.',
      })
      refetch()
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update booking status.',
        variant: 'destructive',
      })
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as BookingStatus | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Expert</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings?.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-mono">{booking.id.slice(0, 8)}</TableCell>
              <TableCell>{booking.expert.full_name}</TableCell>
              <TableCell>{booking.client.full_name}</TableCell>
              <TableCell>
                {formatDateTime(booking.start_time)}
              </TableCell>
              <TableCell>{booking.status}</TableCell>
              <TableCell>{booking.payment_status}</TableCell>
              <TableCell>
                {formatPrice(booking.amount, booking.currency)}
              </TableCell>
              <TableCell>
                <Select
                  value={booking.status}
                  onValueChange={(value) =>
                    updateStatusMutation.mutate({
                      bookingId: booking.id,
                      status: value as BookingStatus,
                    })
                  }
                  disabled={booking.status === 'completed'}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirm</SelectItem>
                    <SelectItem value="cancelled">Cancel</SelectItem>
                    <SelectItem value="completed">Complete</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}