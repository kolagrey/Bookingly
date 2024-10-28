import { bookingService } from '@/lib/api/booking-service'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { emailService } from '@/lib/email/email-service'

jest.mock('@supabase/auth-helpers-nextjs')
jest.mock('@/lib/email/email-service')

describe('bookingService', () => {
  const mockSupabase = {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: { id: 'test-booking' },
            error: null,
          })),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: { id: 'test-booking', status: 'confirmed' },
              error: null,
            })),
          })),
        })),
      })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          gte: jest.fn(() => ({
            lte: jest.fn(() => ({
              data: [{ id: 'test-booking' }],
              error: null,
            })),
          })),
        })),
      })),
    })),
  }

  beforeEach(() => {
    ;(createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase)
    ;(emailService.sendBookingConfirmation as jest.Mock).mockResolvedValue(undefined)
    ;(emailService.sendBookingStatusUpdate as jest.Mock).mockResolvedValue(undefined)
  })

  describe('createBooking', () => {
    it('creates a booking and sends confirmation email', async () => {
      const booking = {
        expert_id: 'expert-1',
        client_id: 'client-1',
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        status: 'pending',
        payment_status: 'pending',
        amount: 100,
        currency: 'USD',
      }

      const { data, error } = await bookingService.createBooking(booking)

      expect(error).toBeNull()
      expect(data).toEqual({ id: 'test-booking' })
      expect(emailService.sendBookingConfirmation).toHaveBeenCalled()
    })
  })

  describe('updateBookingStatus', () => {
    it('updates booking status and sends notification', async () => {
      const { data, error } = await bookingService.updateBookingStatus(
        'test-id',
        'confirmed'
      )

      expect(error).toBeNull()
      expect(data).toEqual({ id: 'test-booking', status: 'confirmed' })
      expect(emailService.sendBookingStatusUpdate).toHaveBeenCalled()
    })
  })

  describe('getExpertBookings', () => {
    it('fetches expert bookings for date range', async () => {
      const startDate = new Date()
      const endDate = new Date()
      
      const { data, error } = await bookingService.getExpertBookings(
        'expert-1',
        startDate,
        endDate
      )

      expect(error).toBeNull()
      expect(data).toEqual([{ id: 'test-booking' }])
    })
  })
})