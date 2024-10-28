import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const guidelines = [
  {
    title: 'Expertise Requirements',
    items: [
      'Minimum 5 years of professional experience',
      'Verifiable credentials and work history',
      'Active industry participation',
      'Strong communication skills',
    ],
  },
  {
    title: 'Session Quality Standards',
    items: [
      'Thorough session preparation',
      'Professional and punctual conduct',
      'Clear communication and guidance',
      'Actionable feedback and resources',
    ],
  },
  {
    title: 'Platform Policies',
    items: [
      'Maintain up-to-date availability calendar',
      'Respond to booking requests within 24 hours',
      'Maintain minimum 4.5-star rating',
      'Follow cancellation and rescheduling policies',
    ],
  },
]

export default function ExpertGuidelinesPage() {
  return (
    <main className="flex-1">
      <section className="relative py-20 bg-muted/30">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Expert Guidelines
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Our platform maintains high standards to ensure the best experience for both experts and clients. Review our guidelines to understand what it takes to succeed as an expert.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-4xl">
          <div className="space-y-16">
            {guidelines.map((section) => (
              <div key={section.title}>
                <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
                <ul className="grid gap-4">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <Button asChild size="lg">
              <Link href="/auth/login?as=expert">
                Apply as an Expert
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}