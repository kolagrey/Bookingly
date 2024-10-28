import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/health', () => {
    return HttpResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        supabase: {
          status: 'healthy',
          latency: 100,
        },
        stripe: {
          status: 'healthy',
          latency: 150,
        },
      },
    })
  }),

  http.post('/api/bookings', async ({ request }) => {
    const booking = await request.json()
    return HttpResponse.json({
      id: 'test-booking-id',
      ...{},
      created_at: new Date().toISOString(),
    })
  }),

  http.get('/api/experts', () => {
    return HttpResponse.json([
      {
        id: 'expert-1',
        full_name: 'John Doe',
        expertise: ['Web Development'],
        hourly_rate: 100,
        rating: 4.8,
      },
    ])
  }),

  http.get('/api/transactions', () => {
    return HttpResponse.json([
      {
        id: 'txn-1',
        amount: 10000,
        currency: 'USD',
        status: 'succeeded',
        created_at: new Date().toISOString(),
      },
    ])
  }),
]