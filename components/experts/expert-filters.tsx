'use client'

import { useQuery } from '@tanstack/react-query'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { expertService } from '@/lib/api/expert-service'
import { type FilterOptions } from '@/types/experts'

interface ExpertFiltersProps {
  value: FilterOptions
  onChange: (filters: FilterOptions) => void
}

export function ExpertFilters({ value, onChange }: ExpertFiltersProps) {
  const { data: categories } = useQuery({
    queryKey: ['expertise-categories'],
    queryFn: () => expertService.getExpertiseCategories(),
  })

  const updateFilter = (key: keyof FilterOptions, newValue: any) => {
    onChange({ ...value, [key]: newValue })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Expertise</Label>
        <div className="space-y-2">
          {categories?.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox
                id={category.id}
                checked={value.expertise.includes(category.id)}
                onCheckedChange={(checked: any) => {
                  updateFilter(
                    'expertise',
                    checked
                      ? [...value.expertise, category.id]
                      : value.expertise.filter((id) => id !== category.id)
                  )
                }}
              />
              <Label htmlFor={category.id}>{category.name}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Minimum Rating</Label>
        <Slider
          min={0}
          max={5}
          step={0.5}
          value={[value.minRating]}
          onValueChange={([rating]: any) => updateFilter('minRating', rating)}
        />
        <div className="text-sm text-muted-foreground">
          {value.minRating} stars or higher
        </div>
      </div>

      <div className="space-y-2">
        <Label>Maximum Hourly Rate</Label>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={[value.maxPrice]}
          onValueChange={([price]: any) => updateFilter('maxPrice', price)}
        />
        <div className="text-sm text-muted-foreground">
          Up to ${value.maxPrice}/hour
        </div>
      </div>

      <div className="space-y-2">
        <Label>Availability</Label>
        <Select
          value={value.availability}
          onValueChange={(availability) =>
            updateFilter('availability', availability)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This week</SelectItem>
            <SelectItem value="next-week">Next week</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}