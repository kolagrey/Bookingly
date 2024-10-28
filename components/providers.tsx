'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/react'
import { useState, useEffect } from 'react'
import { initPostHog } from '@/lib/monitoring/posthog'
import { initSentry } from '@/lib/monitoring/sentry'
import { reportWebVitals } from '@/lib/monitoring/performance'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  useEffect(() => {
    // Initialize monitoring tools
    initSentry()
    initPostHog()

    // Report web vitals
    reportWebVitals({ path: window.location.pathname })
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Analytics />
      </ThemeProvider>
    </QueryClientProvider>
  )
}