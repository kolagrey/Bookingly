'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { authService } from '@/lib/auth/auth-service'
import { Icons } from '@/components/icons'
import { useToast } from '@/components/ui/use-toast'

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type EmailForm = z.infer<typeof emailSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showEmailSent, setShowEmailSent] = useState(false)
  const { toast } = useToast()
  
  const form = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  })

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true)
      await authService.signInWithProvider(provider)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign in. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailLogin = async (data: EmailForm) => {
    try {
      setIsLoading(true)
      const { error } = await authService.signInWithEmail(data.email)
      
      if (error) throw error
      
      setShowEmailSent(true)
      toast({
        title: 'Check your email',
        description: 'We sent you a login link. Be sure to check your spam folder.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send login link. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {!showEmailSent ? (
            <>
              <form onSubmit={form.handleSubmit(handleEmailLogin)} className="grid gap-2">
                <Input
                  type="email"
                  placeholder="name@example.com"
                  {...form.register('email')}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Sign in with Email'
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                disabled={isLoading}
                onClick={() => handleSocialLogin('google')}
              >
                <Icons.google className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button
                variant="outline"
                disabled={isLoading}
                onClick={() => handleSocialLogin('github')}
              >
                <Icons.gitHub className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </>
          ) : (
            <div className="text-center">
              <Icons.mail className="mx-auto h-6 w-6 mb-2" />
              <p className="text-sm text-muted-foreground">
                Check your email for a sign in link. You can close this window.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}