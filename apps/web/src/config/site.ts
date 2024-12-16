import { env } from "~/env"

export const siteConfig = {
  name: "OpenAlternative",
  tagline: "Open Source Alternatives to Popular Software",
  description:
    "A curated collection of the best open source alternatives to everyday SaaS products. Save money with reliable tools hand-picked for you.",
  email: env.NEXT_PUBLIC_SITE_EMAIL,
  url: env.NEXT_PUBLIC_SITE_URL,

  alphabet: "abcdefghijklmnopqrstuvwxyz",
  toolsPerPage: 35,
  alternativesPerPage: 54,

  affiliateUrl: "https://go.openalternative.co",
}
