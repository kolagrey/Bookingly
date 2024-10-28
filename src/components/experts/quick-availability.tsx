'use client'

import { useQuery } from '@tanstack/react-query'
import { availabilityService } from '@/lib/api/availability-service'
import { format } from 'date-fns'

interface QuickAvailabilityProps {
  expertId: string
}

export function QuickAvailability({ expertId }: QuickAvailabilityProps) {
  const { data: nextSlot } = useQuery({
    queryKey: ['next-availability', expertId],
    queryFn: () => availabilityService.getNextAvailableSlot(expertId),
  })

  if (!nextSlot) {
    return <span>No availability</span>
  }

  return (
    <span>
      Next available: {format(new Date(nextSlot.start), 'EEE, MMM d')}
    </span>
  )
}