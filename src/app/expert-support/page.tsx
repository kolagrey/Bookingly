import { LifeBuoy, MessageSquare, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const supportChannels = [
  {
    title: 'Live Chat',
    description: 'Get instant help from our expert support team',
    icon: MessageSquare,
    action: 'Start Chat',
    href: '#chat',
  },
  {
    title: 'Phone Support',
    description: 'Speak directly with our expert success team',
    icon: Phone,
    action: 'Call Us',
    href: 'tel:+1234567890',
  },
  {
    title: 'Email Support',
    description: 'Send us a detailed message anytime',
    icon: Mail,
    action: 'Email Us',
    href: 'mailto:expert-support@example.com',
  },
]

const faqs = [
  {
    question: 'How do I get paid for my sessions?',
    answer: 'Payments are automatically processed after each completed session. We handle payment processing and transfer funds to your connected bank account within 2-3 business days.',
  },
  {
    question: 'What happens if a client cancels?',
    answer: 'If a client cancels more than 24 hours before the session, no fee is charged. For late cancellations, you will receive 50% of the session fee as compensation.',
  },
  {
    question: 'How can I improve my visibility on the platform?',
    answer: 'Maintain a high rating, keep your calendar up-to-date, respond quickly to inquiries, and collect verified reviews from your clients. Complete your profile with detailed expertise information and portfolio items.',
  },
]

export default function ExpertSupportPage() {
  return (
    <main className="flex-1">
      <section className="relative py-20 bg-muted/30">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-full bg-primary/10">
              <LifeBuoy className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Expert Support</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            We're here to help you succeed. Get the support you need, when you need it.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            {supportChannels.map((channel) => (
              <Card key={channel.title} className="p-6">
                <channel.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{channel.title}</h3>
                <p className="text-muted-foreground mb-4">{channel.description}</p>
                <Button asChild>
                  <a href={channel.href}>{channel.action}</a>
                </Button>
              </Card>
            ))}
          </div>

          <div className="mt-20">
            <h2 className="text-2xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}