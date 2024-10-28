import { NextRequest } from 'next/server'
import { headers } from 'next/headers'
import crypto from 'crypto'
import { POST } from '@/app/api/webhooks/paystack/route'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

jest.mock('next/headers')
jest.mock('@supabase/auth-helpers-nextjs')
jest.mock('crypto')

describe('Paystack Webhook Handler', () => {
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
    ;(crypto.createHmac as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue('test-signature'),
    })
  })

  it('verifies webhook signature', async () => {
    const mockEvent = {
      event: 'charge.success',
      data: {
        reference: 'ref_123',
        status: 'success',
      },
    }

    const request = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify(mockEvent),
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
    expect(mockSupabase.from).toHaveBeenCalledWith('bookings')
  })

  it('handles invalid signatures', async () => {
    ;(crypto.createHmac as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue('invalid-signature'),
    })

    const request = new NextRequest('http://localhost', {
      method: 'POST',
      body: '{}',
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('processes charge.success event', async () => {
    const mockEvent = {
      event: 'charge.success',
      data: {
        reference: 'ref_123',
        status: 'success',
      },
    }

    const request = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify(mockEvent),
    })

    await POST(request)

    expect(mockSupabase.from).toHaveBeenCalledWith('bookings')
    expect(mockSupabase.from().update).toHaveBeenCalledWith({
      payment_status: 'paid',
      status: 'confirmed',
      paystack_reference: 'ref_123',
      updated_at: expect.any(String),
    })
  })
})