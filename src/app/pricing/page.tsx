import { Check } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const tiers = [
  {
    name: 'Basic',
    price: 49,
    description: 'Perfect for one-time consultations and quick advice.',
    features: [
      '30-minute session',
      'Chat support',
      'Session recording',
      'Basic expert selection',
      'Payment protection',
    ],
  },
  {
    name: 'Professional',
    price: 149,
    description: 'Ideal for ongoing mentorship and detailed guidance.',
    features: [
      '3 x 45-minute sessions',
      'Priority chat support',
      'Session recordings',
      'Advanced expert matching',
      'Custom session scheduling',
      'Follow-up resources',
      'Money-back guarantee',
    ],
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 499,
    description: 'Comprehensive support for teams and organizations.',
    features: [
      '10 x 60-minute sessions',
      '24/7 priority support',
      'Session recordings',
      'VIP expert access',
      'Flexible scheduling',
      'Custom learning paths',
      'Team collaboration tools',
      'Dedicated account manager',
    ],
  },
]

export default function PricingPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative py-20 bg-muted/30">
        <div className="container max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Choose the perfect plan for your needs. All plans include access to our verified experts and secure platform features.
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20">
        <div className="container max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-lg border ${
                  tier.featured ? 'border-primary shadow-lg scale-105' : ''
                } bg-background p-8`}
              >
                <h3 className="text-2xl font-bold">{tier.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span className="ml-2 text-muted-foreground">/month</span>
                </div>
                <p className="mt-4 text-muted-foreground">{tier.description}</p>
                <ul className="mt-8 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="mt-8 w-full"
                  variant={tier.featured ? 'default' : 'outline'}
                >
                  <Link href="/auth/login">Get Started</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, PayPal, and bank transfers for enterprise plans.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do unused sessions expire?</h3>
              <p className="text-muted-foreground">
                Sessions are valid for 3 months from the purchase date. Enterprise plans have extended validity periods.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What's your refund policy?</h3>
              <p className="text-muted-foreground">
                We offer a 100% money-back guarantee if you're not satisfied with your first session.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl font-bold">Start Your Growth Journey Today</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of professionals who are accelerating their careers with expert guidance.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/auth/login">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}