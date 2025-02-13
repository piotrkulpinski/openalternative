import type { Metadata } from "next"
import { linksConfig } from "~/config/links"
import { siteConfig } from "~/config/site"

export const metadataConfig: Metadata = {
  openGraph: {
    url: "/",
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    images: { url: `${siteConfig.url}/opengraph.png`, width: 1200, height: 630 },
  },
  twitter: {
    site: "@ossalternative",
    creator: "@piotrkulpinski",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": linksConfig.feeds },
  },
}
