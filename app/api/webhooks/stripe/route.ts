import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { captureException } from '@/lib/monitoring/sentry'
import { auditLog } from '@/lib/security/audit'
import { emailService } from '@/lib/email/email-service'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )

    const supabase = createRouteHandlerClient({ cookies })

    // Log webhook event
    await auditLog({
      action: 'STRIPE_WEBHOOK',
      resource: event.type,
      metadata: {
        event_id: event.id,
        type: event.type,
      },
    })

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const { data: booking } = await supabase
          .from('bookings')
          .update({
            payment_status: 'paid',
            status: 'confirmed',
            stripe_payment_id: paymentIntent.id,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_payment_intent', paymentIntent.id)
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

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await supabase
          .from('bookings')
          .update({
            payment_status: 'failed',
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_payment_intent', paymentIntent.id)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        await supabase
          .from('bookings')
          .update({
            payment_status: 'refunded',
            status: 'cancelled',
            refund_id: charge?.refunds?.data[0].id,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_payment_id', charge.payment_intent)
        break
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute
        await supabase
          .from('bookings')
          .update({
            dispute_status: 'pending',
            dispute_id: dispute.id,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_payment_id', dispute.payment_intent)
        break
      }

      case 'charge.dispute.closed': {
        const dispute = event.data.object as Stripe.Dispute
        await supabase
          .from('bookings')
          .update({
            dispute_status: dispute.status,
            updated_at: new Date().toISOString(),
          })
          .eq('dispute_id', dispute.id)
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