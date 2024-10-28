'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { AvailabilityPicker } from './availability-picker'
import { SessionConfig } from './session-config'
import { PaymentMethod } from './payment-method'
import { BookingSummary } from './booking-summary'
import { bookingService } from '@/lib/api/booking-service'
import { type Expert, type User, type TimeSlot } from '@/types/database'
import { SessionConfigOption } from '@/types/experts'

interface BookingWizard {
  expert: Expert
  user: User
}

type BookingStep = 'datetime' | 'session' | 'payment' | 'summary'

export function BookingWizard({ expert, user }: BookingWizard) {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState<BookingStep>('datetime')
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>()
  const [sessionConfig, setSessionConfig] = useState<SessionConfigOption>({
    duration: 60,
    format: 'online' as const,
  })
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paystack'>('stripe')

  const createBooking = useMutation({
    mutationFn: async () => {
      if (!selectedSlot) return

      const booking = {
        expert_id: expert.id,
        client_id: user.id,
        start_time: selectedSlot.start,
        end_time: selectedSlot.end,
        duration: sessionConfig.duration,
        format: sessionConfig.format,
        amount: (expert.hourly_rate / 60) * sessionConfig.duration,
        currency: expert.preferred_currency,
        payment_method: paymentMethod
      }

      const { data, error } = await bookingService.createBooking(booking)
      if (error) throw error
      return data
    },
    onSuccess: (booking) => {
      toast({
        title: 'Booking confirmed',
        description: `Your session is scheduled for ${format(
          new Date(booking.start_time),
          'PPpp'
        )}`,
      })
      router.push('/dashboard/bookings')
    },
    onError: () => {
      toast({
        title: 'Booking failed',
        description: 'Failed to create booking. Please try again.',
        variant: 'destructive',
      })
    },
  })

  const nextStep = () => {
    switch (step) {
      case 'datetime':
        setStep('session')
        break
      case 'session':
        setStep('payment')
        break
      case 'payment':
        setStep('summary')
        break
      case 'summary':
        createBooking.mutate()
        break
    }
  }

  const prevStep = () => {
    switch (step) {
      case 'session':
        setStep('datetime')
        break
      case 'payment':
        setStep('session')
        break
      case 'summary':
        setStep('payment')
        break
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {step === 'datetime' && (
          <AvailabilityPicker
            expertId={expert.id}
            onSlotSelect={setSelectedSlot}
          />
        )}

        {step === 'session' && (
          <SessionConfig
            value={sessionConfig}
            onChange={setSessionConfig}
            hourlyRate={expert.hourly_rate}
            currency={expert.preferred_currency}
          />
        )}

        {step === 'payment' && (
          <PaymentMethod
            value={paymentMethod}
            onChange={setPaymentMethod}
          />
        )}

        {step === 'summary' && (
          <BookingSummary
            expert={expert}
            slot={selectedSlot!}
            config={sessionConfig}
            amount={(expert.hourly_rate / 60) * sessionConfig.duration}
            currency={expert.preferred_currency}
          />
        )}

        <div className="flex justify-between">
          {step !== 'datetime' && (
            <Button
              variant="outline"
              onClick={prevStep}
            >
              Back
            </Button>
          )}
          <Button
            onClick={nextStep}
            disabled={
              (step === 'datetime' && !selectedSlot) ||
              createBooking.isPending
            }
          >
            {step === 'summary'
              ? createBooking.isPending
                ? 'Confirming...'
                : 'Confirm Booking'
              : 'Continue'}
          </Button>
        </div>
      </div>
    </Card>
  )
}