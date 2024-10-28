'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExpertManagement } from '@/components/admin/expert-management'
import { ClientManagement } from '@/components/admin/client-management'
import { BookingManagement } from '@/components/admin/booking-management'
import { Card } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/lib/api/admin-service'

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('bookings')

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminService.getStats(),
  })

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold">{stats?.totalUsers ?? 0}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Active Experts</p>
            <p className="text-2xl font-bold">{stats?.activeExperts ?? 0}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Bookings</p>
            <p className="text-2xl font-bold">{stats?.totalBookings ?? 0}</p>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="experts">Experts</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings">
          <BookingManagement />
        </TabsContent>
        
        <TabsContent value="experts">
          <ExpertManagement />
        </TabsContent>
        
        <TabsContent value="clients">
          <ClientManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}