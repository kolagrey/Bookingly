import { NextResponse } from 'next/server'
import { healthService } from '@/lib/monitoring/health'
import { captureException } from '@/lib/monitoring/sentry'

export async function GET() {
  try {
    const [supabaseHealth, stripeHealth] = await Promise.all([
      healthService.checkSupabase(),
      healthService.checkStripe(),
    ])

    const isHealthy = 
      supabaseHealth.status === 'healthy' && 
      stripeHealth.status === 'healthy'

    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        supabase: supabaseHealth,
        stripe: stripeHealth,
      },
    })
  } catch (error) {
    captureException(error as Error)
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    }, { status: 500 })
  }
}