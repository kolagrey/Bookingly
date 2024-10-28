'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export function FeatureAnalytics() {
  const [timeRange, setTimeRange] = useState<string>('7d')
  const [metric, setMetric] = useState<string>('bookings')

  const { data: analytics } = useQuery({
    queryKey: ['feature-analytics', metric, timeRange],
    queryFn: async () => {
      const response = await fetch(
        `/api/admin/analytics?metric=${metric}&range=${timeRange}`
      )
      return response.json()
    },
  })

  const { data: topFeatures } = useQuery({
    queryKey: ['top-features', timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/admin/analytics/top-features?range=${timeRange}`)
      return response.json()
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Select value={metric} onValueChange={setMetric}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bookings">Bookings</SelectItem>
            <SelectItem value="revenue">Revenue</SelectItem>
            <SelectItem value="users">Active Users</SelectItem>
            <SelectItem value="experts">Expert Signups</SelectItem>
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topFeatures?.map((feature: any) => (
          <Card key={feature.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {feature.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{feature.usage}</div>
              <p className="text-xs text-muted-foreground">
                {feature.trend > 0 ? '+' : ''}{feature.trend}% vs previous period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}