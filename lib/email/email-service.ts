import { Resend } from 'resend'
import { type Booking } from '@/types/database'
import { BookingConfirmationEmail } from './templates/booking-confirmation'
import { BookingStatusUpdateEmail } from './templates/booking-status-update'
import { ContactNotificationEmail } from './templates/contact-notification'
import { BookingRescheduleEmail } from './templates/booking-reschedule'

const resend = new Resend(process.env.RESEND_API_KEY)

export const emailService = {
  async sendBookingConfirmation(booking: Booking & {
    expert: { full_name: string; email: string }
    client: { full_name: string; email: string }
  }) {
    // Send to client
    await resend.emails.send({
      from: 'Expert Booking <bookings@yourdomain.com>',
      to: booking.client.email,
      subject: 'Booking Confirmation',
      react: BookingConfirmationEmail({ booking }),
    })

    // Send to expert
    await resend.emails.send({
      from: 'Expert Booking <bookings@yourdomain.com>',
      to: booking.expert.email,
      subject: 'New Booking Received',
      react: BookingStatusUpdateEmail({ booking, recipient: 'expert' }),
    })
  },

  async sendBookingStatusUpdate(booking: Booking & {
    expert: { full_name: string; email: string }
    client: { full_name: string; email: string }
  }) {
    // Send to client
    await resend.emails.send({
      from: 'Expert Booking <bookings@yourdomain.com>',
      to: booking.client.email,
      subject: 'Booking Status Update',
      react: BookingStatusUpdateEmail({ booking, recipient: 'client' }),
    })

    // Send to expert
    await resend.emails.send({
      from: 'Expert Booking <bookings@yourdomain.com>',
      to: booking.expert.email,
      subject: 'Booking Status Update',
      react: BookingStatusUpdateEmail({ booking, recipient: 'expert' }),
    })
  },

  async sendBookingRescheduleNotification(booking: Booking & {
    expert: { full_name: string; email: string }
    client: { full_name: string; email: string }
  }) {
    // Send to client
    await resend.emails.send({
      from: 'Expert Booking <bookings@yourdomain.com>',
      to: booking.client.email,
      subject: 'Booking Rescheduled',
      react: BookingRescheduleEmail({ booking, recipient: 'client' }),
    })

    // Send to expert
    await resend.emails.send({
      from: 'Expert Booking <bookings@yourdomain.com>',
      to: booking.expert.email,
      subject: 'Booking Rescheduled',
      react: BookingRescheduleEmail({ booking, recipient: 'expert' }),
    })
  },

  async sendContactNotification({
    to,
    subject,
    submission,
  }: {
    to: string
    subject: string
    submission: any
  }) {
    await resend.emails.send({
      from: 'Expert Booking <no-reply@yourdomain.com>',
      to,
      subject,
      react: ContactNotificationEmail({ submission }),
    })
  },
}