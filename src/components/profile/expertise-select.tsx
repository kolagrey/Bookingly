'use client'

import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { expertService } from '@/lib/api/expert-service'

interface ExpertiseSelectProps {
  value: Array<{
    category_id: string
    years_experience: number
  }>
  onChange: (value: Array<{
    category_id: string
    years_experience: number
  }>) => void
  disabled?: boolean
}

export function ExpertiseSelect({
  value,
  onChange,
  disabled,
}: ExpertiseSelectProps) {
  const { data: categories } = useQuery({
    queryKey: ['expertise-categories'],
    queryFn: () => expertService.getExpertiseCategories(),
  })

  const addExpertise = () => {
    if (!categories?.length) return
    onChange([
      ...value,
      {
        category_id: categories[0].id,
        years_experience: 0,
      },
    ])
  }

  const removeExpertise = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const updateExpertise = (index: number, field: string, newValue: any) => {
    onChange(
      value.map((item, i) =>
        i === index ? { ...item, [field]: newValue } : item
      )
    )
  }

  if (!categories) return null

  return (
    <div className="space-y-4">
      {value.map((expertise, index) => (
        <div key={index} className="flex gap-4 items-end">
          <div className="flex-1 space-y-2">
            <Label>Category</Label>
            <select
              value={expertise.category_id}
              onChange={(e) =>
                updateExpertise(index, 'category_id', e.target.value)
              }
              disabled={disabled}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-32 space-y-2">
            <Label>Years</Label>
            <Input
              type="number"
              min="0"
              value={expertise.years_experience}
              onChange={(e) =>
                updateExpertise(
                  index,
                  'years_experience',
                  parseInt(e.target.value)
                )
              }
              disabled={disabled}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => removeExpertise(index)}
            disabled={disabled}
          >
            Remove
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addExpertise}
        disabled={disabled}
      >
        Add Expertise
      </Button>
    </div>
  )
}