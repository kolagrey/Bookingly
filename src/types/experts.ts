export type SortOption = 'rating' | 'experience' | 'price-low' | 'price-high'

export interface FilterOptions {
  expertise: string[]
  minRating: number
  maxPrice: number
  availability: 'any' | 'today' | 'this-week' | 'next-week'
}

export interface SearchParams {
  searchTerm?: string
  filters?: FilterOptions
  sort?: SortOption
}

export interface SessionConfigOption { duration: number; format: 'online' | 'in-person' }