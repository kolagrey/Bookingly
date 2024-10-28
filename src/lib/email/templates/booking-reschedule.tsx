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
  import { type Booking } from '@/types/database'
  
  interface BookingRescheduleEmailProps {
    booking: Booking & {
      expert: { full_name: string }
      client: { full_name: string }
    }
    recipient: 'expert' | 'client'
  }
  
  export function BookingRescheduleEmail({ booking, recipient }: BookingRescheduleEmailProps) {
    const recipientName = recipient === 'client' 
      ? booking.client.full_name 
      : booking.expert.full_name
  
    const otherPartyName = recipient === 'client'
      ? booking.expert.full_name
      : booking.client.full_name
  
    return (
      <Html>
        <Head />
        <Preview>Your booking has been rescheduled</Preview>
        <Body style={{ fontFamily: 'system-ui' }}>
          <Container>
            <Heading>Booking Rescheduled</Heading>
            <Section>
              <Text>Dear {recipientName},</Text>
              <Text>
                Your booking with {otherPartyName} has been rescheduled to{' '}
                {formatDateTime(booking.start_time)}.
              </Text>
            </Section>
            <Section>
              <Text>
                If this new time doesn't work for you, please contact us as soon as possible
                to find an alternative time slot.
              </Text>
            </Section>
            <Section>
              <Text>
                You can view the full booking details in your dashboard.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    )
  }