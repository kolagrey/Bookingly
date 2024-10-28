import { loadStripe } from '@stripe/stripe-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export const paymentService = {
  async createStripePayment(bookingId: string) {
    const response = await fetch('/api/payments/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId }),
    })
    const { sessionId } = await response.json()
    const stripe = await stripePromise
    return stripe?.redirectToCheckout({ sessionId })
  },

  async createPaystackPayment(bookingId: string) {
    const response = await fetch('/api/payments/paystack', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId }),
    })
    const { authorization_url } = await response.json()
    window.location.href = authorization_url
  },

  async handlePaymentSuccess(bookingId: string, provider: string) {
    const { error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'paid',
        status: 'confirmed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)

    return { error }
  },
}