'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PhotoUpload } from '@/components/profile/photo-upload'
import { TimezoneSelect } from '@/components/profile/timezone-select'
import { CurrencySelect } from '@/components/profile/currency-select'
import { SocialLinks } from '@/components/profile/social-links'
import { ExpertiseSelect } from '@/components/profile/expertise-select'
import { authService } from '@/lib/auth/auth-service'
import { expertService } from '@/lib/api/expert-service'
import { profileService } from '@/lib/api/profile-service'
import { useToast } from '@/components/ui/use-toast'

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  location: z.string().optional(),
  timezone: z.string(),
  preferred_currency: z.string(),
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  hourly_rate: z.number().min(0, 'Hourly rate must be positive'),
  expertise: z.array(z.object({
    category_id: z.string(),
    years_experience: z.number(),
  })).min(1, 'Select at least one expertise'),
  buffer_time: z.number().min(0).max(60),
  portfolio_url: z.string().url().optional().or(z.literal('')),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  twitter_handle: z.string().optional(),
  instagram_handle: z.string().optional(),
})

type ProfileForm = z.infer<typeof profileSchema>

export default function ExpertProfilePage() {
  const [activeTab, setActiveTab] = useState('general')
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  const { data: expert, refetch } = useQuery({
    queryKey: ['expert-profile'],
    queryFn: async () => {
      const user = await authService.getCurrentUser()
      if (!user) return null
      return expertService.getExpertProfile(user.id)
    },
  })

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: expert?.full_name || '',
      location: expert?.location || '',
      timezone: expert?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      preferred_currency: expert?.preferred_currency || 'USD',
      bio: expert?.bio || '',
      hourly_rate: expert?.hourly_rate || 0,
      expertise: expert?.expertise || [],
      buffer_time: expert?.buffer_time || 15,
      portfolio_url: expert?.portfolio_url || '',
      linkedin_url: expert?.linkedin_url || '',
      twitter_handle: expert?.twitter_handle || '',
      instagram_handle: expert?.instagram_handle || '',
    },
  })

  const updateProfile = useMutation({
    mutationFn: async (data: ProfileForm) => {
      if (!expert) return
      const [profileUpdate, expertUpdate] = await Promise.all([
        profileService.updateProfile(expert.id, {
          full_name: data.full_name,
          location: data.location,
          timezone: data.timezone,
          preferred_currency: data.preferred_currency,
        }),
        expertService.updateExpertProfile(expert.id, {
          bio: data.bio,
          hourly_rate: data.hourly_rate,
          expertise: data.expertise,
          buffer_time: data.buffer_time,
          portfolio_url: data.portfolio_url,
          linkedin_url: data.linkedin_url,
          twitter_handle: data.twitter_handle,
          instagram_handle: data.instagram_handle,
        }),
      ])
      return { profileUpdate, expertUpdate }
    },
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

  if (!expert) return null

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Expert Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="expertise">Expertise</TabsTrigger>
              <TabsTrigger value="social">Social Links</TabsTrigger>
            </TabsList>

            <form onSubmit={form.handleSubmit((data) => updateProfile.mutate(data))}>
              <TabsContent value="general" className="space-y-6">
                <PhotoUpload
                  userId={expert.id}
                  currentPhotoUrl={expert.avatar_url}
                  userName={expert.full_name}
                  onUpload={(url) => refetch()}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      {...form.register('full_name')}
                      disabled={!isEditing}
                    />
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
                </div>

                <div className="space-y-2">
                  <Label>Professional Bio</Label>
                  <Textarea
                    {...form.register('bio')}
                    disabled={!isEditing}
                    className="h-32"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Hourly Rate</Label>
                    <Input
                      type="number"
                      {...form.register('hourly_rate', { valueAsNumber: true })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Buffer Time (minutes)</Label>
                    <Input
                      type="number"
                      {...form.register('buffer_time', { valueAsNumber: true })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="expertise">
                <ExpertiseSelect
                  value={form.watch('expertise')}
                  onChange={(value) => form.setValue('expertise', value)}
                  disabled={!isEditing}
                />
              </TabsContent>

              <TabsContent value="social">
                <SocialLinks
                  values={{
                    portfolio_url: form.watch('portfolio_url'),
                    linkedin_url: form.watch('linkedin_url'),
                    twitter_handle: form.watch('twitter_handle'),
                    instagram_handle: form.watch('instagram_handle'),
                  }}
                  onChange={(key, value) => form.setValue(key as any, value)}
                  disabled={!isEditing}
                />
              </TabsContent>

              <div className="flex justify-end gap-2 mt-6">
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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}