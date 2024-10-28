'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value?: number
  onChange?: (value: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function StarRating({
  value = 0,
  onChange,
  readonly = false,
  size = 'md',
}: StarRatingProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          className={cn(
            'text-muted-foreground hover:text-yellow-400 transition-colors',
            value >= rating && 'text-yellow-400',
            readonly && 'cursor-default hover:text-current'
          )}
          onClick={() => !readonly && onChange?.(rating)}
          disabled={readonly}
        >
          <Star
            className={cn(
              sizes[size],
              'fill-current'
            )}
          />
        </button>
      ))}
    </div>
  )
}