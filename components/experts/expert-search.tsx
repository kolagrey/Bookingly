'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface ExpertSearchProps {
  value: string
  onChange: (value: string) => void
}

export function ExpertSearch({ value, onChange }: ExpertSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search experts..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8"
      />
    </div>
  )
}