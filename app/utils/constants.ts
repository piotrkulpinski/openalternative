export const SITE_URL = import.meta.env.VITE_SITE_URL
export const SITE_EMAIL = import.meta.env.VITE_SITE_EMAIL
export const SITE_NAME = "OpenAlternative"
export const SITE_TAGLINE = "Discover Open Source Alternatives to Popular Software"
export const SITE_DESCRIPTION =
  "OpenAlternative is a platform that helps you find open source alternatives to popular software. We’ve curated some great open source alternatives to tools that your business requires in day-to-day operations."

export const JSON_HEADERS =
  process.env.NODE_ENV === "development"
    ? {
        headers: {
          "Cache-Control":
            "public, max-age=3600, stale-while-revalidate=3600, stale-if-error=86400",
        },
      }
    : undefined
