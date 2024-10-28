import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  topic: z.enum(['general', 'technical', 'billing', 'expert']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type ContactForm = z.infer<typeof contactFormSchema>

export interface ContactSubmission extends ContactForm {
  created_at?: string
  status?: 'pending' | 'processed' | 'resolved'
}