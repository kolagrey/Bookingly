'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { healthService } from '@/lib/monitoring/health'
import { formatDateTime } from '@/lib/utils'

export function SystemHealth() {
  const { data: healthStatus, refetch } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      const response = await fetch('/api/health')
      return response.json()
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500'
      case 'degraded':
        return 'bg-yellow-500'
      case 'unhealthy':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthStatus?.services && Object.entries(healthStatus.services).map(([service, data]: [string, any]) => (
          <Card key={service}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {service.charAt(0).toUpperCase() + service.slice(1)}
              </CardTitle>
              <Badge className={getStatusColor(data.status)}>
                {data.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(data.latency)}ms</div>
              <p className="text-xs text-muted-foreground">
                Last checked: {formatDateTime(data.timestamp)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {healthStatus?.error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {healthStatus.error}
        </div>
      )}
    </div>
  )
}