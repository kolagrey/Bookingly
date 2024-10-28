import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { formatDateTime, formatPrice } from '@/lib/utils'
import { type Booking } from '@/types/database'

interface BookingConfirmationEmailProps {
  booking: Booking & {
    expert: { full_name: string }
    client: { full_name: string }
  }
}

export function BookingConfirmationEmail({ booking }: BookingConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your booking has been confirmed</Preview>
      <Body style={{ fontFamily: 'system-ui' }}>
        <Container>
          <Heading>Booking Confirmation</Heading>
          <Section>
            <Text>Dear {booking.client.full_name},</Text>
            <Text>
              Your booking with {booking.expert.full_name} has been confirmed for{' '}
              {formatDateTime(booking.start_time)}.
            </Text>
            <Text>
              Amount: {formatPrice(booking.amount, booking.currency)}
            </Text>
          </Section>
          <Section>
            <Text>
              If you need to make any changes to your booking, please contact us
              as soon as possible.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}