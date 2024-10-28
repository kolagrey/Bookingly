import posthog from 'posthog-js'

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      capture_pageview: false,
      persistence: 'localStorage',
      autocapture: true,
    })
  }
}

export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  posthog.capture(eventName, properties)
}

export const identifyUser = (
  userId: string,
  properties?: Record<string, any>
) => {
  posthog.identify(userId, properties)
}