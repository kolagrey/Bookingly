'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { BookingWizard } from '@/components/booking/booking-wizard'
import { authService } from '@/lib/auth/auth-service'
import { expertService } from '@/lib/api/expert-service'
import { LoginPrompt } from '@/components/auth/login-prompt'

interface BookingPageProps {
  params: {
    id: string
  }
}

export default function BookingPage({ params }: BookingPageProps) {
  const router = useRouter()
  const [showLogin, setShowLogin] = useState(false)

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getCurrentUser(),
  })

  const { data: expert } = useQuery({
    queryKey: ['expert', params.id],
    queryFn: () => expertService.getExpertProfile(params.id),
  })

  if (!user && !showLogin) {
    return (
      <LoginPrompt
        message="Please log in to book a session"
        onLogin={() => setShowLogin(true)}
      />
    )
  }

  if (!expert) return null

  return (
    <div className="container max-w-2xl py-8">
      <BookingWizard expert={expert} user={user!} />
    </div>
  )
}