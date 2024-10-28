import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type Booking, type TimeSlot } from '@/types/database'
import { emailService } from '@/lib/email/email-service'

const supabase = createClientComponentClient()

export const bookingService = {
  async createBooking(booking: Omit<Booking, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select(`
        *,
        expert:experts(
          users(full_name, email)
        ),
        client:users!client_id(
          full_name,
          email
        )
      `)
      .single()

    if (data && !error) {
      await emailService.sendBookingConfirmation(data)
    }

    return { data, error }
  },

  async getBooking(bookingId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        expert:experts(
          users(
            full_name,
            email,
            timezone
          )
        ),
        client:users!client_id(
          full_name,
          email,
          timezone
        )
      `)
      .eq('id', bookingId)
      .single()

    return { data, error }
  },

  async updateBookingStatus(bookingId: string, status: Booking['status']) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', bookingId)
      .select(`
        *,
        expert:experts(
          users(full_name, email)
        ),
        client:users!client_id(
          full_name,
          email
        )
      `)
      .single()

    if (data && !error) {
      await emailService.sendBookingStatusUpdate(data)
    }

    return { data, error }
  },

  async rescheduleBooking(
    bookingId: string,
    newTimes: { start_time: string; end_time: string }
  ) {
    // First get the current booking to check status
    const { data: booking } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (!booking) {
      throw new Error('Booking not found')
    }

    if (!['pending', 'confirmed'].includes(booking.status)) {
      throw new Error('Cannot reschedule a cancelled or completed booking')
    }

    // Update the booking times
    const { data, error } = await supabase
      .from('bookings')
      .update({
        start_time: newTimes.start_time,
        end_time: newTimes.end_time,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .select(`
        *,
        expert:experts(
          users(full_name, email)
        ),
        client:users!client_id(
          full_name,
          email
        )
      `)
      .single()

    if (error) throw error

    if (data) {
      // Send notifications about the reschedule
      await emailService.sendBookingRescheduleNotification(data)
    }

    return { data, error }
  },

  async getExpertBookings(expertId: string, startDate: Date, endDate: Date) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('expert_id', expertId)
      .gte('start_time', startDate.toISOString())
      .lte('end_time', endDate.toISOString())
    return { data, error }
  },

  async getClientBookings(startDate: Date, endDate: Date) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        expert:experts(
          users(full_name)
        )
      `)
      .gte('start_time', startDate.toISOString())
      .lte('end_time', endDate.toISOString())
    return { data, error }
  },

  async getAvailableSlots(
    expertId: string,
    date: Date
  ): Promise<TimeSlot[]> {
    const { data: schedule } = await supabase
      .from('availability_schedules')
      .select('weekday_schedule, exceptions')
      .eq('expert_id', expertId)
      .single()

    if (!schedule) return []

    // TODO: Implement slot calculation logic considering
    // weekday schedule, exceptions, and existing bookings
    return []
  },
}