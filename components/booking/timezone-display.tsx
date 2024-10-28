import { Globe } from 'lucide-react'
import { getCurrentTimezoneOffset } from '@/lib/utils/timezone'

interface TimezoneDisplayProps {
  timezone: string
  className?: string
}

export function TimezoneDisplay({ timezone, className }: TimezoneDisplayProps) {
  const offset = getCurrentTimezoneOffset(timezone)

  return (
    <div className={className}>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Globe className="h-4 w-4" />
        <span>{timezone.replace('_', ' ')}</span>
        <span>({offset})</span>
      </div>
    </div>
  )
}