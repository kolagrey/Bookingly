'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TransactionFiltersProps {
  value: {
    status: string
    dateRange: string
    search: string
  }
  onChange: (filters: {
    status: string
    dateRange: string
    search: string
  }) => void
}

export function TransactionFilters({
  value,
  onChange,
}: TransactionFiltersProps) {
  return (
    <div className="p-4 flex gap-4">
      <Select
        value={value.status}
        onValueChange={(status) => onChange({ ...value, status })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="succeeded">Succeeded</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
          <SelectItem value="refunded">Refunded</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={value.dateRange}
        onValueChange={(dateRange) => onChange({ ...value, dateRange })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Date range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="24h">Last 24 Hours</SelectItem>
          <SelectItem value="7d">Last 7 Days</SelectItem>
          <SelectItem value="30d">Last 30 Days</SelectItem>
          <SelectItem value="90d">Last 90 Days</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Search transactions..."
        value={value.search}
        onChange={(e) => onChange({ ...value, search: e.target.value })}
        className="max-w-sm"
      />
    </div>
  )
}