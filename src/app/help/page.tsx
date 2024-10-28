import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const categories = [
  {
    title: 'Getting Started',
    articles: [
      { title: 'How to create an account', href: '#' },
      { title: 'Finding the right expert', href: '#' },
      { title: 'Booking your first session', href: '#' },
      { title: 'Payment methods', href: '#' },
    ],
  },
  {
    title: 'Bookings & Sessions',
    articles: [
      { title: 'Managing your bookings', href: '#' },
      { title: 'Rescheduling a session', href: '#' },
      { title: 'Cancellation policy', href: '#' },
      { title: 'Session preparation', href: '#' },
    ],
  },
  {
    title: 'Account & Settings',
    articles: [
      { title: 'Profile settings', href: '#' },
      { title: 'Notification preferences', href: '#' },
      { title: 'Payment settings', href: '#' },
      { title: 'Security settings', href: '#' },
    ],
  },
  {
    title: 'Billing & Payments',
    articles: [
      { title: 'Understanding pricing', href: '#' },
      { title: 'Payment methods', href: '#' },
      { title: 'Refund policy', href: '#' },
      { title: 'Billing FAQ', href: '#' },
    ],
  },
]

export default function HelpCenterPage() {
  return (
    <main className="flex-1">
      <section className="relative py-20 bg-muted/30">
        <div className="container max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            How can we help you?
          </h1>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search help articles..."
              className="pl-10"
            />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            {categories.map((category) => (
              <Card key={category.title} className="p-6">
                <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
                <ul className="space-y-3">
                  {category.articles.map((article) => (
                    <li key={article.title}>
                      <a
                        href={article.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {article.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
            <p className="text-muted-foreground mb-8">
              Our support team is available 24/7 to assist you
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild variant="outline">
                <a href="mailto:support@example.com">Email Support</a>
              </Button>
              <Button asChild>
                <a href="#chat">Live Chat</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}