import { ArrowRight, Calendar, CheckCircle, MessageSquare, Star } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const steps = [
  {
    icon: Star,
    title: 'Find Your Expert',
    description: 'Browse our curated network of industry experts. Filter by expertise, experience, and ratings to find the perfect match for your needs.',
  },
  {
    icon: Calendar,
    title: 'Book a Session',
    description: 'Choose a convenient time slot from your expert\'s real-time availability calendar. Select your preferred session duration and format.',
  },
  {
    icon: MessageSquare,
    title: 'Connect & Learn',
    description: 'Meet your expert via our secure platform. Get personalized guidance, actionable insights, and follow-up resources.',
  },
  {
    icon: CheckCircle,
    title: 'Grow & Succeed',
    description: 'Apply your learnings, track your progress, and book follow-up sessions to accelerate your professional growth.',
  },
]

export default function HowItWorksPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative py-20 bg-muted/30">
        <div className="container max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Your Journey to Professional Growth
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Connect with industry experts in just a few clicks. Our platform makes it easy to find, book, and learn from the best in your field.
          </p>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link href="/experts">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="container max-w-5xl">
          <div className="grid gap-12 md:grid-cols-2">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Everything You Need to Succeed</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our platform is designed to provide the best possible experience for both experts and clients.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-semibold mb-2">Verified Experts</h3>
              <p className="text-muted-foreground">
                Every expert is thoroughly vetted for expertise, experience, and communication skills.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-semibold mb-2">Secure Platform</h3>
              <p className="text-muted-foreground">
                End-to-end encrypted video calls and secure payment processing.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-semibold mb-2">Money-Back Guarantee</h3>
              <p className="text-muted-foreground">
                Not satisfied with your session? Get a full refund, no questions asked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="rounded-3xl bg-primary px-8 py-16 sm:px-16 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground">
                Ready to Start Your Journey?
              </h2>
              <p className="mt-6 text-lg text-primary-foreground/80">
                Join thousands of professionals who are accelerating their careers with expert guidance.
              </p>
              <div className="mt-10 flex justify-center gap-x-6">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/experts">Browse Experts</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-primary-foreground">
                  <Link href="/auth/login?as=expert">Become an Expert</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}