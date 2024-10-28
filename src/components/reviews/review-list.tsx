'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { StarRating } from '@/components/reviews/star-rating'
import { formatDateTime } from '@/lib/utils'
import { type Review, type ReviewCategory } from '@/types/database'

interface ReviewListProps {
  reviews: Array<Review & {
    client: {
      full_name: string
      avatar_url?: string
    }
    ratings: Array<{
      category_id: string
      rating: number
    }>
  }>
  categories: ReviewCategory[]
}

export function ReviewList({ reviews, categories }: ReviewListProps) {
  return (
    <div className="space-y-8">
      {reviews.map((review) => (
        <div key={review.id} className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={review.client.avatar_url} />
              <AvatarFallback>
                {review.client.full_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{review.client.full_name}</p>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(review.created_at)}
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            {categories.map((category) => {
              const rating = review.ratings.find(
                (r) => r.category_id === category.id
              )
              return (
                <div key={category.id} className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground min-w-[100px]">
                    {category.name}
                  </span>
                  <StarRating
                    value={rating?.rating || 0}
                    readonly
                    size="sm"
                  />
                </div>
              )
            })}
          </div>

          <p className="text-sm">{review.comment}</p>

          {review.verified && (
            <p className="text-sm text-green-600 font-medium">
              Verified Booking
            </p>
          )}
        </div>
      ))}
    </div>
  )
}