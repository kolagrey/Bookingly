'use client'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatPrice } from '@/lib/utils'
import { SessionConfigOption } from '@/types/experts'

interface SessionConfigProps {
  value: {
    duration: number
    format: 'online' | 'in-person'
  }
  onChange: (value: SessionConfigOption) => void
  hourlyRate: number
  currency: string
}

export function SessionConfig({
  value,
  onChange,
  hourlyRate,
  currency,
}: SessionConfigProps) {
  const durations = [
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Session Duration</Label>
        <Select
          value={value.duration.toString()}
          onValueChange={(val) =>
            onChange({ ...value, duration: parseInt(val) })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {durations.map((duration) => (
              <SelectItem
                key={duration.value}
                value={duration.value.toString()}
              >
                {duration.label} -{' '}
                {formatPrice((hourlyRate / 60) * duration.value, currency)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Session Format</Label>
        <Select
          value={value.format}
          onValueChange={(val) =>
            onChange({ ...value, format: val as 'online' | 'in-person' })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="online">Online Meeting</SelectItem>
            <SelectItem value="in-person">In Person</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}