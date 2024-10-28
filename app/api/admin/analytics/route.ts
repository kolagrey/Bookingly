import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const metric = searchParams.get('metric')
  const range = searchParams.get('range')

  const supabase = createRouteHandlerClient({ cookies })

  // Get the appropriate metric data based on the request
  let query
  switch (metric) {
    case 'bookings':
      query = supabase.rpc('get_booking_analytics', { time_range: range })
      break
    case 'revenue':
      query = supabase.rpc('get_revenue_analytics', { time_range: range })
      break
    case 'users':
      query = supabase.rpc('get_user_analytics', { time_range: range })
      break
    case 'experts':
      query = supabase.rpc('get_expert_analytics', { time_range: range })
      break
    default:
      return NextResponse.json({ error: 'Invalid metric' }, { status: 400 })
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}