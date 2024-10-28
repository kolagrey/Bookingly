'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StarRating } from '@/components/reviews/star-rating'
import { reviewService } from '@/lib/api/review-service'
import { useToast } from '@/components/ui/use-toast'
import { type ReviewCategory } from '@/types/database'

const reviewSchema = z.object({
  comment: z.string().min(10, 'Review must be at least 10 characters'),
  ratings: z.array(z.object({
    category_id: z.string(),
    rating: z.number().min(1).max(5),
  })),
})

type ReviewForm = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  expertId: string
  clientId: string
  bookingId: string
  categories: ReviewCategory[]
  onSuccess: () => void
}

export function ReviewForm({
  expertId,
  clientId,
  bookingId,
  categories,
  onSuccess,
}: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  
  const form = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      ratings: categories.map(category => ({
        category_id: category.id,
        rating: 0,
      })),
    },
  })

  const onSubmit = async (data: ReviewForm) => {
    try {
      setIsSubmitting(true)
      const { error } = await reviewService.createReview(
        {
          expert_id: expertId,
          booking_id: bookingId,
          comment: data.comment,
          rating: Math.round(
            data.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
            data.ratings.length
          ),
          client_id: clientId,
          moderation_status: 'pending'
        },
        data.ratings
      )

      if (error) throw error

      toast({
        title: 'Review submitted',
        description: 'Your review will be visible after moderation.',
      })
      onSuccess()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {categories.map((category, index) => (
        <div key={category.id} className="space-y-2">
          <label className="text-sm font-medium">{category.name}</label>
          <StarRating
            value={form.watch(`ratings.${index}.rating`)}
            onChange={(rating) =>
              form.setValue(`ratings.${index}`, {
                category_id: category.id,
                rating,
              })
            }
          />
        </div>
      ))}

      <div className="space-y-2">
        <label className="text-sm font-medium">Review</label>
        <Textarea
          {...form.register('comment')}
          placeholder="Share your experience..."
          className="h-32"
        />
        {form.formState.errors.comment && (
          <p className="text-sm text-destructive">
            {form.formState.errors.comment.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  )
}