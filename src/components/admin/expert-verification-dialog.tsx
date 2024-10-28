'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { adminService } from '@/lib/api/admin-service'
import { useToast } from '@/components/ui/use-toast'

interface ExpertVerificationDialogProps {
  expertId: string
  onClose: () => void
  onVerified: () => void
}

export function ExpertVerificationDialog({
  expertId,
  onClose,
  onVerified,
}: ExpertVerificationDialogProps) {
  const [notes, setNotes] = useState('')
  const { toast } = useToast()

  const { data: expert } = useQuery({
    queryKey: ['expert-details', expertId],
    queryFn: () => adminService.getExpertDetails(expertId),
  })

  const verifyMutation = useMutation({
    mutationFn: (verified: boolean) =>
      adminService.verifyExpert(expertId, verified, notes),
    onSuccess: () => {
      toast({
        title: 'Expert verification updated',
        description: 'The expert\'s verification status has been updated.',
      })
      onVerified()
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update expert verification.',
        variant: 'destructive',
      })
    },
  })

  if (!expert) return null

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Expert: {expert.full_name}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <h3 className="font-semibold">Expertise</h3>
            <p>{expert.expertise.join(', ')}</p>
          </div>

          <div className="grid gap-2">
            <h3 className="font-semibold">Bio</h3>
            <p>{expert.bio}</p>
          </div>

          <div className="grid gap-2">
            <h3 className="font-semibold">Admin Notes</h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add verification notes..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => verifyMutation.mutate(false)}
          >
            Reject
          </Button>
          <Button
            onClick={() => verifyMutation.mutate(true)}
          >
            Verify Expert
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}