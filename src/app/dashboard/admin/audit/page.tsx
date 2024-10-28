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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { adminService } from '@/lib/api/admin-service'
import { formatDateTime } from '@/lib/utils'

export default function AuditLogPage() {
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const { data: auditLogs } = useQuery({
    queryKey: ['audit-logs', actionFilter, searchTerm],
    queryFn: () => adminService.getAuditLogs({ action: actionFilter, search: searchTerm }),
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Audit Log</h1>

      <div className="flex gap-4 mb-6">
        <Select
          value={actionFilter}
          onValueChange={setActionFilter}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search by user or resource..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>User Agent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auditLogs?.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{formatDateTime(log.created_at)}</TableCell>
              <TableCell>{log.user?.full_name || log.user_id}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell className="font-mono text-sm">{log.resource}</TableCell>
              <TableCell>{log.ip_address}</TableCell>
              <TableCell className="truncate max-w-xs" title={log.user_agent}>
                {log.user_agent}
              </TableCell>
            </TableRow>
          ))}

          {!auditLogs?.length && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No audit logs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}