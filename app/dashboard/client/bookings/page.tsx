'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { bookingService } from '@/lib/api/booking-service'
import { formatPrice } from '@/lib/utils'

export default function ClientBookingsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>()

  const { data: bookings } = useQuery({
    queryKey: ['client-bookings', selectedDate],
    queryFn: async () => {
      if (!selectedDate) return []
      const startDate = new Date(selectedDate)
      const endDate = new Date(selectedDate)
      endDate.setDate(endDate.getDate() + 1)
      
      const { data } = await bookingService.getClientBookings(startDate, endDate)
      return data || []
    },
    enabled: !!selectedDate,
  })

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {selectedDate
              ? format(selectedDate, 'EEEE, MMMM d')
              : 'Select a date to view bookings'}
          </h2>
          
          <div className="space-y-4">
            {bookings?.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <h3 className="font-semibold">
                    {format(new Date(booking.start_time), 'h:mm a')} -{' '}
                    {format(new Date(booking.end_time), 'h:mm a')}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p>Expert: {booking.expert.full_name}</p>
                  <p>Status: {booking.status}</p>
                  <p>Amount: {formatPrice(booking.amount, booking.currency)}</p>
                </CardContent>
              </Card>
            ))}
            
            {bookings?.length === 0 && (
              <p className="text-muted-foreground">
                No bookings for this date.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}