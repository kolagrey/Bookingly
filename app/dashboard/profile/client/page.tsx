'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PhotoUpload } from '@/components/profile/photo-upload'
import { TimezoneSelect } from '@/components/profile/timezone-select'
import { CurrencySelect } from '@/components/profile/currency-select'
import { authService } from '@/lib/auth/auth-service'
import { profileService } from '@/lib/api/profile-service'
import { useToast } from '@/components/ui/use-toast'

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  location: z.string().optional(),
  timezone: z.string(),
  preferred_currency: z.string(),
})

type ProfileForm = z.infer<typeof profileSchema>

export default function ClientProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  const { data: user, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getCurrentUser(),
  })

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      location: user?.location || '',
      timezone: user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      preferred_currency: user?.preferred_currency || 'USD',
    },
  })

  const updateProfile = useMutation({
    mutationFn: (data: ProfileForm) =>
      profileService.updateProfile(user!.id, data),
    onSuccess: () => {
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      })
      setIsEditing(false)
      refetch()
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      })
    },
  })

  if (!user) return null

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <PhotoUpload
            userId={user.id}
            currentPhotoUrl={user.avatar_url}
            userName={user.full_name}
            onUpload={(url) => refetch()}
          />

          <form
            onSubmit={form.handleSubmit((data) => updateProfile.mutate(data))}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                {...form.register('full_name')}
                disabled={!isEditing}
              />
              {form.formState.errors.full_name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.full_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                {...form.register('location')}
                disabled={!isEditing}
                placeholder="City, Country"
              />
            </div>

            <div className="space-y-2">
              <Label>Timezone</Label>
              <TimezoneSelect
                value={form.watch('timezone')}
                onChange={(value) => form.setValue('timezone', value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label>Preferred Currency</Label>
              <CurrencySelect
                value={form.watch('preferred_currency')}
                onChange={(value) => form.setValue('preferred_currency', value)}
                disabled={!isEditing}
              />
            </div>

            <div className="flex justify-end gap-2">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateProfile.isPending}
                  >
                    {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}