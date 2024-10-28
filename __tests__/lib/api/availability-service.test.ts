import { availabilityService } from '@/lib/api/availability-service'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { addMinutes, parseISO } from 'date-fns'

jest.mock('@supabase/auth-helpers-nextjs')

describe('availabilityService', () => {
  const mockSupabase = {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(() => ({
          data: {
            weekday_schedule: [],
            exceptions: [],
          },
          error: null,
        })),
      })),
      eq: jest.fn(() => ({
        gte: jest.fn(() => ({
          lte: jest.fn(() => ({
            not: jest.fn(() => ({
              data: [],
              error: null,
            })),
          })),
        })),
      })),
    })),
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(),
    })),
  }

  beforeEach(() => {
    ;(createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  describe('getExpertAvailability', () => {
    it('fetches and processes availability correctly', async () => {
      const date = new Date()
      const timezone = 'UTC'
      const slots = await availabilityService.getExpertAvailability(
        'expert-1',
        date,
        timezone
      )
      expect(slots).toEqual([])
      expect(mockSupabase.from).toHaveBeenCalledWith('availability_schedules')
    })

    it('handles exceptions correctly', async () => {
      mockSupabase.from.mockImplementationOnce(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: {
              weekday_schedule: [],
              exceptions: [{
                date: '2023-12-25',
                available: false,
              }],
            },
            error: null,
          })),
        })),
      }))

      const date = new Date('2023-12-25')
      const slots = await availabilityService.getExpertAvailability(
        'expert-1',
        date,
        'UTC'
      )
      expect(slots).toEqual([])
    })
  })

  describe('calculateAvailableSlots', () => {
    it('applies buffer times correctly', () => {
      const baseSlots = [
        { start: '09:00', end: '10:00' },
        { start: '10:30', end: '11:30' },
      ]
      const bookings = [
        { start_time: '10:15', end_time: '10:45' },
      ]
      const timezone = 'UTC'

      const availableSlots = availabilityService.calculateAvailableSlots(
        baseSlots,
        bookings,
        [],
        timezone
      )

      expect(availableSlots).toEqual([
        { start: '09:00', end: '10:00' },
      ])
    })

    it('handles overlapping slots correctly', () => {
      const baseSlots = [
        { start: '09:00', end: '10:00' },
        { start: '09:30', end: '10:30' },
      ]
      const bookings: any[] = []
      const timezone = 'UTC'

      const availableSlots = availabilityService.calculateAvailableSlots(
        baseSlots,
        bookings,
        [],
        timezone
      )

      expect(availableSlots).toEqual(baseSlots)
    })
  })

  describe('subscribeToAvailabilityUpdates', () => {
    it('sets up subscription correctly', () => {
      const callback = jest.fn()
      const unsubscribe = availabilityService.subscribeToAvailabilityUpdates(
        'expert-1',
        callback
      )

      expect(mockSupabase.channel).toHaveBeenCalled()
      expect(typeof unsubscribe).toBe('function')
    })
  })
})