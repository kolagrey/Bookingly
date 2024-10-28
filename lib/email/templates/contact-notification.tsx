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
import { type ContactSubmission } from '@/types/contact'

interface ContactNotificationEmailProps {
  submission: ContactSubmission
}

export function ContactNotificationEmail({ submission }: ContactNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New Contact Form Submission: {submission.topic}</Preview>
      <Body style={{ fontFamily: 'system-ui' }}>
        <Container>
          <Heading>New Contact Form Submission</Heading>
          <Section>
            <Text>
              <strong>From:</strong> {submission.name} ({submission.email})
            </Text>
            <Text>
              <strong>Topic:</strong> {submission.topic}
            </Text>
            <Text>
              <strong>Message:</strong>
            </Text>
            <Text>{submission.message}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}