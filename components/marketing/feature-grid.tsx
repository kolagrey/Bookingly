import { CheckCircle, Clock, Globe, Shield, Users, Zap } from 'lucide-react'

const features = [
  {
    name: 'Verified Experts',
    description: 'Every expert is thoroughly vetted for expertise and experience',
    icon: Shield,
  },
  {
    name: 'Global Network',
    description: 'Connect with professionals from around the world',
    icon: Globe,
  },
  {
    name: 'Instant Booking',
    description: 'Book sessions with real-time availability',
    icon: Clock,
  },
  {
    name: 'Secure Platform',
    description: 'Protected payments and communication',
    icon: CheckCircle,
  },
  {
    name: 'Community Driven',
    description: 'Verified reviews and testimonials from real clients',
    icon: Users,
  },
  {
    name: 'Fast Support',
    description: '24/7 support for seamless experience',
    icon: Zap,
  },
]

export function FeatureGrid() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Why Choose Our Platform?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to connect with industry experts and grow professionally
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="relative rounded-lg border bg-background p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{feature.name}</h3>
              <p className="mt-2 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}