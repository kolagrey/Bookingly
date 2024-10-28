import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json()
    const supabase = createRouteHandlerClient({ cookies })

    // Get booking details
    const { data: booking } = await supabase
      .from('bookings')
      .select(`
        *,
        client:users!client_id(
          email
        )
      `)
      .eq('id', bookingId)
      .single()

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Initialize Paystack transaction
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: booking.client.email,
        amount: booking.amount * 100,
        currency: booking.currency,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payments/verify?booking_id=${bookingId}`,
        metadata: {
          booking_id: bookingId,
        },
      }),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Paystack initialization failed:', error)
    return NextResponse.json(
      { error: 'Payment initialization failed' },
      { status: 500 }
    )
  }
}