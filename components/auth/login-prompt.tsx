'use client'

import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface LoginPromptProps {
  message?: string
  onLogin: () => void
}

export function LoginPrompt({
  message = 'Please sign in to continue',
  onLogin,
}: LoginPromptProps) {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="max-w-md p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
        <p className="text-muted-foreground mb-6">{message}</p>
        <Button onClick={onLogin} className="w-full">
          Sign In
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Card>
    </div>
  )
}