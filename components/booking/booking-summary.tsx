'use client'

import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { type Expert, type TimeSlot } from '@/types/database'
import { formatPrice } from '@/lib/utils'

interface BookingSummaryProps {
  expert: Expert
  slot: TimeSlot
  config: {
    duration: number
    format: 'online' | 'in-person'
  }
  amount: number
  currency: string
}

export function BookingSummary({
  expert,
  slot,
  config,
  amount,
  currency,
}: BookingSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={expert.avatar_url} alt={expert.full_name} />
          <AvatarFallback>{expert.full_name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{expert.full_name}</h3>
          <p className="text-sm text-muted-foreground">
            {expert.expertise[0]?.category?.name}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Date & Time</span>
          <span className="font-medium">
            {format(new Date(slot.start), 'PPpp')}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Duration</span>
          <span className="font-medium">{config.duration} minutes</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Format</span>
          <span className="font-medium capitalize">{config.format}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Amount</span>
          <span className="font-medium">
            {formatPrice(amount, currency)}
          </span>
        </div>
      </div>
    </div>
  )
}