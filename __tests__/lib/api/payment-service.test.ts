import { paymentService } from '@/lib/api/payment-service'
import { loadStripe } from '@stripe/stripe-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

jest.mock('@stripe/stripe-js')
jest.mock('@supabase/auth-helpers-nextjs')

describe('paymentService', () => {
  const mockStripe = {
    redirectToCheckout: jest.fn(),
  }

  const mockSupabase = {
    from: jest.fn(() => ({
      update: jest.fn(() => ({
        eq: jest.fn(() => ({ error: null })),
      })),
    })),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(loadStripe as jest.Mock).mockResolvedValue(mockStripe)
    ;(createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase)
    global.fetch = jest.fn()
  })

  describe('createStripePayment', () => {
    it('creates Stripe payment and redirects', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve({ sessionId: 'sess_123' }),
      })

      await paymentService.createStripePayment('booking_123')

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/payments/stripe',
        expect.any(Object)
      )
      expect(mockStripe.redirectToCheckout).toHaveBeenCalledWith({
        sessionId: 'sess_123',
      })
    })
  })

  describe('createPaystackPayment', () => {
    it('creates Paystack payment and redirects', async () => {
      const mockUrl = 'https://paystack.com/pay/123'
      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve({ authorization_url: mockUrl }),
      })

      const windowSpy = jest.spyOn(window, 'location', 'get')
      delete window.location
      window.location = { ...window.location, href: '' }

      await paymentService.createPaystackPayment('booking_123')

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/payments/paystack',
        expect.any(Object)
      )
      expect(window.location.href).toBe(mockUrl)

      windowSpy.mockRestore()
    })
  })

  describe('handlePaymentSuccess', () => {
    it('updates booking status after successful payment', async () => {
      const result = await paymentService.handlePaymentSuccess(
        'booking_123',
        'stripe'
      )

      expect(mockSupabase.from).toHaveBeenCalledWith('bookings')
      expect(result.error).toBeNull()
    })
  })
})