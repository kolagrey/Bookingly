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
import { adminService } from '@/lib/api/admin-service'
import { useToast } from '@/components/ui/use-toast'
import { formatDateTime } from '@/lib/utils'

export function ContentModeration() {
  const [moderationNotes, setModerationNotes] = useState('')
  const { toast } = useToast()

  const { data: pendingContent, refetch } = useQuery({
    queryKey: ['pending-content'],
    queryFn: () => adminService.getPendingContent(),
  })

  const handleModeration = async (contentId: string, approved: boolean) => {
    try {
      await adminService.moderateContent(
        contentId,
        approved ? 'approved' : 'rejected',
        moderationNotes
      )

      toast({
        title: 'Content moderated',
        description: `The content has been ${approved ? 'approved' : 'rejected'}.`,
      })
      setModerationNotes('')
      refetch()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to moderate content.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      {pendingContent?.map((content) => (
        <Card key={content.id}>
          <CardHeader>
            <CardTitle>{content.title}</CardTitle>
            <div className="text-sm text-muted-foreground">
              By {content.author.full_name} on{' '}
              {formatDateTime(content.created_at)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Content</h4>
              <p className="text-sm">{content.body}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Moderation Notes</h4>
              <Textarea
                value={moderationNotes}
                onChange={(e) => setModerationNotes(e.target.value)}
                placeholder="Add notes about this content..."
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => handleModeration(content.id, false)}
            >
              Reject
            </Button>
            <Button
              onClick={() => handleModeration(content.id, true)}
            >
              Approve
            </Button>
          </CardFooter>
        </Card>
      ))}

      {!pendingContent?.length && (
        <p className="text-center text-muted-foreground">
          No content pending moderation
        </p>
      )}
    </div>
  )
}