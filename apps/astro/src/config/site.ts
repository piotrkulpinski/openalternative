import { PUBLIC_SITE_EMAIL, PUBLIC_SITE_URL } from "astro:env/client"

export const siteConfig = {
  name: "OpenAlternative",
  tagline: "Open Source Alternatives to Popular Software",
  description:
    "A curated collection of the best open source alternatives to everyday SaaS products. Save money with reliable tools hand-picked for you.",
  email: PUBLIC_SITE_EMAIL,
  url: PUBLIC_SITE_URL,

  alphabet: "abcdefghijklmnopqrstuvwxyz",
  toolsPerPage: 35,
  alternativesPerPage: 54,

  affiliateUrl: "https://go.openalternative.co",
}
