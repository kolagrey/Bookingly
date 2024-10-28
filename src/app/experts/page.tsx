'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ExpertGrid } from '@/components/experts/expert-grid'
import { ExpertSearch } from '@/components/experts/expert-search'
import { ExpertFilters } from '@/components/experts/expert-filters'
import { ExpertSort } from '@/components/experts/expert-sort'
import { expertService } from '@/lib/api/expert-service'
import { type SortOption, type FilterOptions } from '@/types/experts'

export default function ExpertsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    expertise: [],
    minRating: 0,
    maxPrice: 1000,
    availability: 'any',
  })
  const [sort, setSort] = useState<SortOption>('rating')

  const { data: experts, isLoading } = useQuery({
    queryKey: ['experts', searchTerm, filters, sort],
    queryFn: () => expertService.searchExperts({ searchTerm, filters, sort }),
  })

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Find an Expert</h1>

      <div className="grid gap-6 md:grid-cols-[240px,1fr]">
        <aside className="space-y-6">
          <ExpertSearch value={searchTerm} onChange={setSearchTerm} />
          <ExpertFilters value={filters} onChange={setFilters} />
        </aside>

        <main className="space-y-6">
          <div className="flex justify-end">
            <ExpertSort value={sort} onChange={setSort} />
          </div>

          <ExpertGrid experts={experts} isLoading={isLoading} />
        </main>
      </div>
    </div>
  )
}