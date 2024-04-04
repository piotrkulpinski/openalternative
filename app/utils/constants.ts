export const SITE_URL = import.meta.env.VITE_SITE_URL
export const SITE_EMAIL = import.meta.env.VITE_SITE_EMAIL
export const SITE_NAME = "OpenAlternative"
export const SITE_TAGLINE = "Open Source Alternatives to Popular Software"
export const SITE_DESCRIPTION =
  "OpenAlternative is a community-driven list of open source alternatives to proprietary software and applications. Discover the best tools for your needs."

export const TOOLS_PER_PAGE = 45
export const TOPICS_PER_PAGE = 150

export const JSON_HEADERS =
  process.env.NODE_ENV === "development"
    ? {
        headers: {
          "Cache-Control":
            "public, max-age=3600, stale-while-revalidate=3600, stale-if-error=86400",
        },
      }
    : undefined
