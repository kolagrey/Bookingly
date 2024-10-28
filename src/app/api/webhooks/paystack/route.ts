import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { captureException } from '@/lib/monitoring/sentry'
import { auditLog } from '@/lib/security/audit'
import { type PaystackEvent } from '@/types/webhooks'
import { emailService } from '@/lib/email/email-service'

const secret = process.env.PAYSTACK_SECRET_KEY!

function verifySignature(
  payload: string,
  signature: string | null
): boolean {
  if (!signature) return false

  const hash = crypto
    .createHmac('sha512', secret)
    .update(payload)
    .digest('hex')

  return hash === signature
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('x-paystack-signature')

  if (!verifySignature(body, signature)) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    const event = JSON.parse(body) as PaystackEvent
    const supabase = createRouteHandlerClient({ cookies })

    // Log webhook event
    await auditLog({
      action: 'PAYSTACK_WEBHOOK',
      resource: event.event,
      metadata: {
        reference: event.data.reference,
        event: event.event,
      },
    })

    switch (event.event) {
      case 'charge.success': {
        const { data: booking } = await supabase
          .from('bookings')
          .update({
            payment_status: 'paid',
            status: 'confirmed',
            paystack_reference: event.data.reference,
            updated_at: new Date().toISOString(),
          })
          .eq('paystack_reference', event.data.reference)
          .select('*')
          .single()

        if (booking) {
          // Send confirmation emails
          await Promise.all([
            emailService.sendBookingConfirmation(booking),
          ])
        }
        break
      }

      case 'charge.failed': {
        await supabase
          .from('bookings')
          .update({
            payment_status: 'failed',
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('paystack_reference', event.data.reference)
        break
      }

      case 'refund.processed': {
        await supabase
          .from('bookings')
          .update({
            payment_status: 'refunded',
            status: 'cancelled',
            refund_reference: event?.data?.refund?.reference,
            updated_at: new Date().toISOString(),
          })
          .eq('paystack_reference', event.data.reference)
        break
      }

      case 'dispute.create': {
        await supabase
          .from('bookings')
          .update({
            dispute_status: 'pending',
            dispute_id: event.data.id,
            updated_at: new Date().toISOString(),
          })
          .eq('paystack_reference', event?.data?.transaction?.reference)
        break
      }

      case 'dispute.resolve': {
        await supabase
          .from('bookings')
          .update({
            dispute_status: event.data.status,
            updated_at: new Date().toISOString(),
          })
          .eq('dispute_id', event.data.id)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    captureException(error)
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 400 }
    )
  }
}