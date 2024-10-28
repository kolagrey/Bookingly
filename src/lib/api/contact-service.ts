import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type ContactSubmission } from '@/types/contact'
import { emailService } from '@/lib/email/email-service'
import { rateLimit } from '@/lib/security/rate-limit'

const supabase = createClientComponentClient()

export const contactService = {
  async submitContactForm(submission: ContactSubmission) {
    // Rate limiting
    const ip = '127.0.0.1' // In production, get from request
    const { success } = await rateLimit(ip)
    if (!success) {
      throw new Error('Too many requests. Please try again later.')
    }

    // Store in database
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name: submission.name,
        email: submission.email,
        topic: submission.topic,
        message: submission.message,
        status: 'pending',
      })

    if (dbError) throw dbError

    // Send email notification
    await emailService.sendContactNotification({
      to: 'support@example.com',
      subject: `New Contact Form Submission: ${submission.topic}`,
      submission,
    })

    return { success: true }
  },
}