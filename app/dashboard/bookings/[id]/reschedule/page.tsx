'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { AvailabilityPicker } from '@/components/booking/availability-picker'
import { bookingService } from '@/lib/api/booking-service'
import { type TimeSlot } from '@/types/database'
import { useState } from 'react'

interface ReschedulePage {
  params: {
    id: string
  }
}

export default function ReschedulePage({ params }: ReschedulePage) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>()

  const { data: booking } = useQuery({
    queryKey: ['booking', params.id],
    queryFn: () => bookingService.getBooking(params.id),
  })

  const reschedule = useMutation({
    mutationFn: async () => {
      if (!selectedSlot || !booking) return
      return bookingService.rescheduleBooking(booking.data.id, {
        start_time: selectedSlot.start,
        end_time: selectedSlot.end,
      })
    },
    onSuccess: () => {
      toast({
        title: 'Booking rescheduled',
        description: 'Your session has been rescheduled successfully.',
      })
      router.push('/dashboard/bookings')
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to reschedule booking. Please try again.',
        variant: 'destructive',
      })
    },
  })

  if (!booking) return null

  return (
    <div className="container max-w-2xl py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Reschedule Booking</h1>
        
        <AvailabilityPicker
          expertId={booking.data.expert_id}
          onSlotSelect={setSelectedSlot}
        />

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            onClick={() => reschedule.mutate()}
            disabled={!selectedSlot || reschedule.isPending}
          >
            {reschedule.isPending ? 'Rescheduling...' : 'Confirm New Time'}
          </Button>
        </div>
      </Card>
    </div>
  )
}