import { NextRequest } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { POST } from '@/app/api/webhooks/stripe/route'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

jest.mock('next/headers')
jest.mock('@supabase/auth-helpers-nextjs')
jest.mock('stripe')

describe('Stripe Webhook Handler', () => {
  const mockStripe = new Stripe('test_key')
  const mockSupabase = {
    from: jest.fn(() => ({
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: { id: 'test-booking' },
            })),
          })),
        })),
      })),
    })),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(headers as jest.Mock).mockReturnValue({
      get: () => 'test-signature',
    })
    ;(createRouteHandlerClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  it('verifies webhook signature', async () => {
    const mockEvent = {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_123',
          status: 'succeeded',
        },
      },
    }

    ;(mockStripe.webhooks.constructEvent as jest.Mock).mockReturnValue(mockEvent)

    const request = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify(mockEvent),
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
    expect(mockSupabase.from).toHaveBeenCalledWith('bookings')
  })

  it('handles invalid signatures', async () => {
    ;(mockStripe.webhooks.constructEvent as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid signature')
    })

    const request = new NextRequest('http://localhost', {
      method: 'POST',
      body: '{}',
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('processes payment_intent.succeeded event', async () => {
    const mockEvent = {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_123',
          status: 'succeeded',
        },
      },
    }

    ;(mockStripe.webhooks.constructEvent as jest.Mock).mockReturnValue(mockEvent)

    const request = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify(mockEvent),
    })

    await POST(request)

    expect(mockSupabase.from).toHaveBeenCalledWith('bookings')
    expect(mockSupabase.from().update).toHaveBeenCalledWith({
      payment_status: 'paid',
      status: 'confirmed',
      stripe_payment_id: 'pi_123',
      updated_at: expect.any(String),
    })
  })
})