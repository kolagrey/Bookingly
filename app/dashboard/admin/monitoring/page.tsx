'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SystemHealth } from '@/components/admin/monitoring/system-health'
import { EventTracking } from '@/components/admin/monitoring/event-tracking'
import { FeatureAnalytics } from '@/components/admin/monitoring/feature-analytics'

export default function MonitoringPage() {
  const [activeTab, setActiveTab] = useState('health')

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">System Monitoring</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="events">Event Tracking</TabsTrigger>
          <TabsTrigger value="analytics">Feature Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="health">
          <SystemHealth />
        </TabsContent>

        <TabsContent value="events">
          <EventTracking />
        </TabsContent>

        <TabsContent value="analytics">
          <FeatureAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}