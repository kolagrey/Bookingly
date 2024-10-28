import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimit } from '@/lib/security/rate-limit'
import { secureHeaders } from '@/lib/security/secure-headers'
import { auditLog } from '@/lib/security/audit'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Apply secure headers
  Object.entries(secureHeaders).forEach(([key, value]) => {
    res.headers.set(key, value)
  })

  // Rate limiting
  const ip = req.ip ?? '127.0.0.1'
  const { success, limit, remaining, reset } = await rateLimit(ip)
  
  if (!success) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      },
    })
  }

  // Session handling
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Audit logging for authenticated requests
  if (session) {
    await auditLog({
      userId: session.user.id,
      action: req.method,
      resource: req.nextUrl.pathname,
      ip,
      userAgent: req.headers.get('user-agent') || 'unknown',
    })
  }

  // Protected routes logic
  const protectedRoutes = ['/dashboard', '/bookings', '/profile']
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)',
  ],
}