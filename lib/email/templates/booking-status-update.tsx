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
import { formatDateTime } from '@/lib/utils'
import { type Booking, type BookingStatus } from '@/types/database'

interface BookingStatusUpdateEmailProps {
  booking: Booking & {
    expert: { full_name: string }
    client: { full_name: string }
  }
  recipient: 'expert' | 'client'
}

const statusMessages: Record<BookingStatus, string> = {
  pending: 'is awaiting confirmation',
  confirmed: 'has been confirmed',
  cancelled: 'has been cancelled',
  completed: 'has been completed',
}

export function BookingStatusUpdateEmail({ booking, recipient }: BookingStatusUpdateEmailProps) {
  const recipientName = recipient === 'client' 
    ? booking.client.full_name 
    : booking.expert.full_name

  const otherPartyName = recipient === 'client'
    ? booking.expert.full_name
    : booking.client.full_name

  return (
    <Html>
      <Head />
      <Preview>Your booking status has been updated</Preview>
      <Body style={{ fontFamily: 'system-ui' }}>
        <Container>
          <Heading>Booking Status Update</Heading>
          <Section>
            <Text>Dear {recipientName},</Text>
            <Text>
              Your booking with {otherPartyName} for{' '}
              {formatDateTime(booking.start_time)} {statusMessages[booking.status]}.
            </Text>
          </Section>
          <Section>
            <Text>
              If you have any questions, please don't hesitate to contact us.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}