export interface HealthCheck {
  service: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  latency: number
  timestamp: string
}

export const healthService = {
  async checkSupabase(): Promise<HealthCheck> {
    const start = performance.now()
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + '/health')
      const end = performance.now()
      
      return {
        service: 'supabase',
        status: response.ok ? 'healthy' : 'degraded',
        latency: end - start,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        service: 'supabase',
        status: 'unhealthy',
        latency: -1,
        timestamp: new Date().toISOString(),
      }
    }
  },

  async checkStripe(): Promise<HealthCheck> {
    const start = performance.now()
    try {
      const response = await fetch('https://api.stripe.com/v1/health')
      const end = performance.now()
      
      return {
        service: 'stripe',
        status: response.ok ? 'healthy' : 'degraded',
        latency: end - start,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        service: 'stripe',
        status: 'unhealthy',
        latency: -1,
        timestamp: new Date().toISOString(),
      }
    }
  },
}