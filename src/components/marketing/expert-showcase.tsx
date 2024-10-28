'use client'

import { useQuery } from '@tanstack/react-query'
import { ExpertCard } from '@/components/experts/expert-card'
import { expertService } from '@/lib/api/expert-service'

export function ExpertShowcase() {
  const { data: experts } = useQuery({
    queryKey: ['featured-experts'],
    queryFn: () => expertService.getFeaturedExperts(),
  })

  if (!experts?.length) return null

  return (
    <section className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Meet Our Featured Experts
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Learn from the best in their fields
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {experts.slice(0, 3).map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      </div>
    </section>
  )
}