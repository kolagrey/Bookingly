import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'

const stories = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer at Google',
    image: '/testimonials/sarah.jpg',
    expert: 'David Miller',
    expertRole: 'Senior Engineering Manager',
    quote: 'The guidance I received was instrumental in helping me land my dream job at Google. My expert provided practical advice on system design interviews and helped me develop a strategic approach to technical discussions.',
    results: [
      'Improved system design skills',
      'Successful technical interviews',
      'Landed role at Google',
      '40% salary increase',
    ],
  },
  {
    name: 'Michael Rodriguez',
    role: 'Product Manager at Stripe',
    image: '/testimonials/michael.jpg',
    expert: 'Emily Watson',
    expertRole: 'Director of Product',
    quote: 'The mentorship completely transformed my approach to product management. I learned how to prioritize effectively, communicate with stakeholders, and drive product strategy with data.',
    results: [
      'Led successful product launch',
      'Improved stakeholder management',
      'Promoted to senior PM',
      'Built high-performing team',
    ],
  },
  {
    name: 'Jessica Thompson',
    role: 'Startup Founder',
    image: '/testimonials/jessica.jpg',
    expert: 'Alex Carter',
    expertRole: 'Serial Entrepreneur',
    quote: 'The expert guidance helped me avoid common startup pitfalls and accelerate our growth. We successfully raised our seed round and achieved product-market fit faster than expected.',
    results: [
      'Raised $2M seed round',
      'Achieved product-market fit',
      '10x user growth in 6 months',
      'Built strategic partnerships',
    ],
  },
]

const stats = [
  { value: '50,000+', label: 'Successful Sessions' },
  { value: '92%', label: 'Client Satisfaction' },
  { value: '85%', label: 'Career Advancement' },
  { value: '2.5x', label: 'Average ROI' },
]

export default function SuccessStoriesPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative py-20 bg-muted/30">
        <div className="container max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Real Stories, Real Results
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Discover how professionals like you achieved their career goals with expert guidance.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="container max-w-5xl">
          <div className="space-y-20">
            {stories.map((story, index) => (
              <div
                key={story.name}
                className={`flex flex-col gap-8 md:flex-row ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="md:w-1/3">
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={story.image}
                      alt={story.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold">{story.name}</h3>
                    <p className="text-sm text-muted-foreground">{story.role}</p>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <div className="relative">
                    <Quote className="absolute -left-4 -top-4 h-8 w-8 text-muted-foreground/20" />
                    <blockquote className="pl-8">
                      <p className="text-lg">{story.quote}</p>
                      <footer className="mt-4">
                        <p className="text-sm text-muted-foreground">
                          Expert: {story.expert}, {story.expertRole}
                        </p>
                      </footer>
                    </blockquote>
                  </div>
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Key Results:</h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {story.results.map((result) => (
                        <li key={result} className="flex items-center text-sm">
                          <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl font-bold">Write Your Success Story</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of professionals who have transformed their careers with expert guidance.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/experts">
                Find Your Expert
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}