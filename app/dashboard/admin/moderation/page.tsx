'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ReviewModeration } from '@/components/admin/review-moderation'
import { ExpertVerification } from '@/components/admin/expert-verification'
import { ContentModeration } from '@/components/admin/content-moderation'

export default function ModerationPage() {
  const [activeTab, setActiveTab] = useState('reviews')

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Content Moderation</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="experts">Expert Verification</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews">
          <ReviewModeration />
        </TabsContent>

        <TabsContent value="experts">
          <ExpertVerification />
        </TabsContent>

        <TabsContent value="content">
          <ContentModeration />
        </TabsContent>
      </Tabs>
    </div>
  )
}