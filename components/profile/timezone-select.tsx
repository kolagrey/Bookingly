'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TimezoneSelectProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function TimezoneSelect({
  value,
  onChange,
  disabled,
}: TimezoneSelectProps) {
  const timezones = Intl.supportedValuesOf('timeZone')

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {timezones.map((timezone) => (
          <SelectItem key={timezone} value={timezone}>
            {timezone.replace('_', ' ')}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}