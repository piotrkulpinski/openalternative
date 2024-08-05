export const SITE_URL = import.meta.env.VITE_SITE_URL
export const SITE_EMAIL = import.meta.env.VITE_SITE_EMAIL
export const SITE_NAME = "OpenAlternative"
export const SITE_TAGLINE = "Open Source Alternatives to Popular Software"
export const SITE_DESCRIPTION =
  "OpenAlternative is a community-driven list of open source alternatives to proprietary software and applications. Discover the best tools for your needs."

export const SITE_STATS = {
  visitors: 500,
  tools: 250,
  subscribers: 1000,
  stars: 900,
}

export const RSS_URL = `${SITE_URL}/rss.xml`
export const TWITTER_URL = "https://x.com/ossalternative"
export const TWITTER_AUTHOR_URL = "https://x.com/piotrkulpinski"
export const GITHUB_URL = "https://github.com/piotrkulpinski/openalternative"
export const FRAMER_TEMPLATE_URL = "https://r.baseline.supply/aperto-oa"

export const LATEST_TOOLS_TRESHOLD = new Date(new Date().setDate(new Date().getDate() - 7))
export const TOPICS_PER_PAGE = 150

export const DAY_IN_MS = 1000 * 60 * 60 * 24

export const SPONSORING_PRICE = 15
export const SPONSORING_PREMIUM_TRESHOLD = 30

export const JSON_HEADERS =
  import.meta.env.NODE_ENV === "development"
    ? {
        "Cache-Control": "public, max-age=3600, s-maxage=7200 stale-while-revalidate=3.154e7",
      }
    : undefined
