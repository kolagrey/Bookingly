import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { googleCalendarService } from '@/lib/integrations/google-calendar'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (!code) {
    return NextResponse.redirect(new URL('/dashboard?error=no_code', request.url))
  }

  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    await googleCalendarService.handleCallback(code, session.user.id)
    
    return NextResponse.redirect(
      new URL('/dashboard?success=calendar_connected', request.url)
    )
  } catch (error) {
    console.error('Google Calendar integration error:', error)
    return NextResponse.redirect(
      new URL('/dashboard?error=calendar_connection_failed', request.url)
    )
  }
}