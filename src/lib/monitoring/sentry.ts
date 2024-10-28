import * as Sentry from '@sentry/nextjs'

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  })
}

export const captureException = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, {
    extra: context,
  })
}

export const setUserContext = (user: { id: string; email: string; role: string }) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    role: user.role,
  })
}