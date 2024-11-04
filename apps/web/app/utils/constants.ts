import type { SponsoringOne } from "~/services.server/api"

export const SITE_URL = import.meta.env.NEXT_PUBLIC_SITE_URL
export const SITE_EMAIL = import.meta.env.NEXT_PUBLIC_SITE_EMAIL
export const SITE_NAME = "OpenAlternative"
export const SITE_TAGLINE = "Open Source Alternatives to Popular Software"
export const SITE_DESCRIPTION =
  "A curated collection of the best open source alternatives to everyday SaaS products. Save money with reliable tools hand-picked for you."

export const SITE_STATS = {
  pageviews: 150000,
  tools: 300,
  subscribers: 1800,
  stars: 1700,
}

export const ALPHABET = "abcdefghijklmnopqrstuvwxyz"

export const AUTHOR_URL = "https://x.com/piotrkulpinski"
export const TWITTER_URL = "https://x.com/ossalternative"
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

export const DAY_IN_MS = 1000 * 60 * 60 * 24
export const TOPICS_PER_PAGE = 150
export const SUBMISSION_POSTING_RATE = 3

export const SPONSORING_PRICE = 15
export const SPONSORING_PREMIUM_TRESHOLD = 30

export const FAMILY_LINKS = [
  {
    title: "DevSuite",
    href: "https://devsuite.co",
    description: "A collection of developer tools that help you Ship Faster",
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

export const HOSTING_SPONSOR: SponsoringOne | null = {
  name: "Easypanel",
  description:
    "Use an intuitive interface to deploy applications, manage databases, and provision SSL certificates.",
  website: "https://easypanel.io",
  faviconUrl: "https://easypanel.io/img/favicon.ico",
}

export const BANNER_SPONSOR: SponsoringOne | null = null

export const JSON_HEADERS = {
  "Cache-Control": "public, max-age=3600, s-maxage=7200 stale-while-revalidate=3.154e7",
}
