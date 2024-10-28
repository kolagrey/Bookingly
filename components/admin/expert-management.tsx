'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { adminService } from '@/lib/api/admin-service'
import { ExpertVerificationDialog } from './expert-verification-dialog'
import { formatDateTime } from '@/lib/utils'

export function ExpertManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null)

  const { data: experts, refetch } = useQuery({
    queryKey: ['admin-experts', searchTerm],
    queryFn: () => adminService.getExperts({ search: searchTerm }),
  })

  const handleVerificationComplete = () => {
    setSelectedExpert(null)
    refetch()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search experts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Expertise</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {experts?.map((expert) => (
            <TableRow key={expert.id}>
              <TableCell>{expert.full_name}</TableCell>
              <TableCell>{expert.email}</TableCell>
              <TableCell>{expert.expertise.join(', ')}</TableCell>
              <TableCell>{expert.verified ? 'Yes' : 'No'}</TableCell>
              <TableCell>{formatDateTime(expert.created_at)}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedExpert(expert.id)}
                >
                  Review
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedExpert && (
        <ExpertVerificationDialog
          expertId={selectedExpert}
          onClose={() => setSelectedExpert(null)}
          onVerified={handleVerificationComplete}
        />
      )}
    </div>
  )
}