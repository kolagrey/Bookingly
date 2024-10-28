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

export function ExpertVerification() {
  const [verificationNotes, setVerificationNotes] = useState('')
  const { toast } = useToast()

  const { data: pendingExperts, refetch } = useQuery({
    queryKey: ['pending-experts'],
    queryFn: () => adminService.getPendingExperts(),
  })

  const handleVerification = async (expertId: string, approved: boolean) => {
    try {
      await adminService.verifyExpert(expertId, approved, verificationNotes)

      toast({
        title: 'Expert verified',
        description: `The expert has been ${approved ? 'verified' : 'rejected'}.`,
      })
      setVerificationNotes('')
      refetch()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify expert.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      {pendingExperts?.map((expert) => (
        <Card key={expert.id}>
          <CardHeader>
            <CardTitle>{expert.full_name}</CardTitle>
            <div className="text-sm text-muted-foreground">
              Joined {formatDateTime(expert.created_at)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Expertise</h4>
              <p className="text-sm">{expert.expertise.join(', ')}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Bio</h4>
              <p className="text-sm">{expert.bio}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Verification Notes</h4>
              <Textarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Add notes about this expert..."
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => handleVerification(expert.id, false)}
            >
              Reject
            </Button>
            <Button
              onClick={() => handleVerification(expert.id, true)}
            >
              Verify
            </Button>
          </CardFooter>
        </Card>
      ))}

      {!pendingExperts?.length && (
        <p className="text-center text-muted-foreground">
          No experts pending verification
        </p>
      )}
    </div>
  )
}