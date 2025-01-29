import * as Sentry from "@sentry/nextjs"

Sentry.init({
  enabled: process.env.NODE_ENV === "production",
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1,
  debug: false,
})
