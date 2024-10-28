'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StarRating } from '@/components/reviews/star-rating'
import { adminService } from '@/lib/api/admin-service'
import { useToast } from '@/components/ui/use-toast'
import { formatDateTime } from '@/lib/utils'

export function ReviewModeration() {
  const [moderationNotes, setModerationNotes] = useState('')
  const { toast } = useToast()

  const { data: pendingReviews, refetch } = useQuery({
    queryKey: ['pending-reviews'],
    queryFn: () => adminService.getPendingReviews(),
  })

  const handleModeration = async (reviewId: string, approved: boolean) => {
    try {
      await adminService.moderateReview(
        reviewId,
        approved ? 'approved' : 'rejected',
        moderationNotes
      )

      toast({
        title: 'Review moderated',
        description: `The review has been ${approved ? 'approved' : 'rejected'}.`,
      })
      setModerationNotes('')
      refetch()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to moderate review.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      {pendingReviews?.map((review) => (
        <Card key={review.id}>
          <CardHeader>
            <CardTitle>Review for {review.expert.full_name}</CardTitle>
            <div className="text-sm text-muted-foreground">
              By {review.client.full_name} on{' '}
              {formatDateTime(review.created_at)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Rating</h4>
              <StarRating value={review.rating} readonly />
            </div>
            <div>
              <h4 className="font-medium mb-2">Comment</h4>
              <p className="text-sm">{review.comment}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Moderation Notes</h4>
              <Textarea
                value={moderationNotes}
                onChange={(e) => setModerationNotes(e.target.value)}
                placeholder="Add notes about this review..."
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => handleModeration(review.id, false)}
            >
              Reject
            </Button>
            <Button
              onClick={() => handleModeration(review.id, true)}
            >
              Approve
            </Button>
          </CardFooter>
        </Card>
      ))}

      {!pendingReviews?.length && (
        <p className="text-center text-muted-foreground">
          No reviews pending moderation
        </p>
      )}
    </div>
  )
}