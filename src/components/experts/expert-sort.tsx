'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type SortOption } from '@/types/experts'

interface ExpertSortProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

export function ExpertSort({ value, onChange }: ExpertSortProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="rating">Highest Rated</SelectItem>
        <SelectItem value="experience">Most Experienced</SelectItem>
        <SelectItem value="price-low">Price: Low to High</SelectItem>
        <SelectItem value="price-high">Price: High to Low</SelectItem>
      </SelectContent>
    </Select>
  )
}