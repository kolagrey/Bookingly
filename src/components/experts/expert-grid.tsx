'use client'

import { ExpertCard } from './expert-card'
import { ExpertCardSkeleton } from './expert-card-skeleton'
import { type Expert } from '@/types/database'

interface ExpertGridProps {
  experts?: Expert[]
  isLoading?: boolean
}

export function ExpertGrid({ experts, isLoading }: ExpertGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ExpertCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!experts?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No experts found</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {experts.map((expert) => (
        <ExpertCard key={expert.id} expert={expert} />
      ))}
    </div>
  )
}