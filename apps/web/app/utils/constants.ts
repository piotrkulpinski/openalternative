export const SITE_URL = import.meta.env.NEXT_PUBLIC_SITE_URL
export const SITE_EMAIL = import.meta.env.NEXT_PUBLIC_SITE_EMAIL
export const SITE_NAME = "OpenAlternative"
export const SITE_TAGLINE = "Open Source Alternatives to Popular Software"
export const SITE_DESCRIPTION =
  "A curated collection of the best open source alternatives to everyday SaaS products. Save money with reliable tools hand-picked for you."

export const SITE_STATS = {
  pageviews: 180000,
  tools: 300,
  subscribers: 1900,
  stars: 2300,
}

export const ALPHABET = "abcdefghijklmnopqrstuvwxyz"

export const AUTHOR_URL = "https://kulpinski.pl"
export const TWITTER_URL = "https://x.com/ossalternative"
export const BLUESKY_URL = "https://bsky.app/profile/openalternative.co"
export const LINKEDIN_URL = "https://linkedin.com/company/openalternative"
export const GITHUB_URL = "https://github.com/piotrkulpinski/openalternative"
export const ANALYTICS_URL = "https://go.openalternative.co/analytics"

export const FEATURED_ALTERNATIVES = [
  "keap",
  "monday",
  "notion",
  "airtable",
  "typeform",
  "teamwork",
  "todoist",
  "kissmetrics",
  "fathom-analytics",
]

export const TOPICS_PER_PAGE = 150
export const SUBMISSION_POSTING_RATE = 3

export const FAMILY_LINKS = [
  {
    title: "DevSuite",
    href: "https://devsuite.co",
    description: "Find the perfect developer tools for your next project",
  },
  {
    title: "Superstash",
    href: "https://superstash.co",
    description: "No-code directory website builder",
  },
  {
    title: "Chipmunk Theme",
    href: "https://chipmunktheme.com",
    description: "Build directory websites in WordPress",
  },
]

export const JSON_HEADERS = {
  "Cache-Control": "public, max-age=3600, s-maxage=7200 stale-while-revalidate=3.154e7",
}
