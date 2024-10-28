import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type TimeSlot, type AvailabilitySchedule, BookingTime } from '@/types/database'
import { addMinutes, isWithinInterval, parseISO } from 'date-fns'
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'
import { googleCalendarService } from '@/lib/integrations/google-calendar'

const supabase = createClientComponentClient()

const BUFFER_TIME = 15 // minutes between bookings

export const availabilityService = {
  async getExpertAvailability(
    expertId: string,
    date: Date,
    timezone: string
  ): Promise<TimeSlot[]> {
    // Get expert's base schedule
    const { data: schedule } = await supabase
      .from('availability_schedules')
      .select('weekday_schedule, exceptions')
      .eq('expert_id', expertId)
      .single()

    if (!schedule) return []

    // Get existing bookings
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const { data: bookings } = await supabase
      .from('bookings')
      .select('start_time, end_time')
      .eq('expert_id', expertId)
      .gte('start_time', startOfDay.toISOString())
      .lte('end_time', endOfDay.toISOString())
      .not('status', 'eq', 'cancelled')

    // Get Google Calendar events if connected
    const googleEvents = await googleCalendarService.getEvents(expertId, startOfDay, endOfDay)

    // Convert schedule to user's timezone
    const daySchedule = this.getScheduleForDate(schedule, date, timezone)
    if (!daySchedule.length) return []

    // Apply buffers and remove booked slots
    return this.calculateAvailableSlots(
      daySchedule,
      bookings || [],
      googleEvents || [],
      timezone
    )
  },

  getScheduleForDate(
    schedule: AvailabilitySchedule,
    date: Date,
    timezone: string
  ): TimeSlot[] {
    const localDate = utcToZonedTime(date, timezone)
    const dayOfWeek = localDate.getDay()
    const dateStr = date.toISOString().split('T')[0]

    // Check for date exception
    const exception = schedule.exceptions.find(e => e.date === dateStr)
    if (exception) {
      return exception.available ? (exception.slots || []) : []
    }

    // Get regular weekday schedule
    const weekdaySchedule = schedule.weekday.find(d => d.day === dayOfWeek)
    return weekdaySchedule?.slots || []
  },

  calculateAvailableSlots(
    baseSlots: TimeSlot[],
    bookings: Array<BookingTime>,
    googleEvents: Array<BookingTime>,
    timezone: string
  ): TimeSlot[] {
    const availableSlots: TimeSlot[] = []

    for (const slot of baseSlots) {
      const slotStart = parseISO(slot.start)
      const slotEnd = parseISO(slot.end)
      
      // Add buffer times
      const bufferStart = addMinutes(slotStart, -BUFFER_TIME)
      const bufferEnd = addMinutes(slotEnd, BUFFER_TIME)

      // Check if slot conflicts with any booking
      const isBooked = [...bookings, ...googleEvents].some(booking => {
        const bookingStart = zonedTimeToUtc(parseISO(booking.start_time || booking.start), timezone)
        const bookingEnd = zonedTimeToUtc(parseISO(booking.end_time || booking.end), timezone)

        return isWithinInterval(bookingStart, { start: bufferStart, end: bufferEnd }) ||
               isWithinInterval(bookingEnd, { start: bufferStart, end: bufferEnd })
      })

      if (!isBooked) {
        availableSlots.push(slot)
      }
    }

    return availableSlots
  },

  async subscribeToAvailabilityUpdates(
    expertId: string,
    callback: (slots: TimeSlot[]) => void
  ) {
    const channel = supabase
      .channel(`availability:${expertId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'availability_schedules',
          filter: `expert_id=eq.${expertId}`,
        },
        async (payload) => {
          // Refresh availability when schedule changes
          const date = new Date()
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
          const slots = await this.getExpertAvailability(expertId, date, timezone)
          callback(slots)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  },
}