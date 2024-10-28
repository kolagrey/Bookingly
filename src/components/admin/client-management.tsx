'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { adminService } from '@/lib/api/admin-service'
import { formatDateTime } from '@/lib/utils'

export function ClientManagement() {
  const [searchTerm, setSearchTerm] = useState('')

  const { data: clients } = useQuery({
    queryKey: ['admin-clients', searchTerm],
    queryFn: () => adminService.getClients({ search: searchTerm }),
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Total Bookings</TableHead>
            <TableHead>Last Booking</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients?.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{client.full_name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.total_bookings}</TableCell>
              <TableCell>
                {client.last_booking_date
                  ? formatDateTime(client.last_booking_date)
                  : 'Never'}
              </TableCell>
              <TableCell>{formatDateTime(client.created_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}