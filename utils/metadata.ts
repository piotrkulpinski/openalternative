import merge from "deepmerge"
import type { Metadata } from "next"
import { config } from "~/config"

export const parseMetadata = ({
  title: metaTitle = config.site.tagline,
  description = config.site.description,
  ...metadata
}: Metadata): Metadata => {
  const title = `${metaTitle} – ${config.site.name}`

  const customMetadata = {
    title,
    description,
    openGraph: {
      url: "/",
      siteName: config.site.name,
      locale: "en_US",
      type: "website",
      // Remove this once we have a custom tool images
      images: { url: `${config.site.url}/opengraph.png`, width: 1200, height: 630 },
    },
    twitter: {
      site: "@devsuite",
      creator: "@piotrkulpinski",
    },
    alternates: {
      canonical: "/",
      types: { "application/rss+xml": config.links.feed },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }

  return merge(customMetadata, metadata, { arrayMerge: (_, sourceArray) => sourceArray })
}
