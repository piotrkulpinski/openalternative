import merge from "deepmerge"
import { Metadata } from "next"
import { config } from "~/config"
import { env } from "~/env"

export const parseMetadata = ({ title, description, ...metadata }: Metadata) => {
  const metaTitle = title ? `${title} – ${config.title}` : config.title
  const metaDescription = description || config.description

  const customMetadata = {
    metadataBase: env.SITE_URL,
    title: metaTitle,
    description: metaDescription,
    icons: { icon: "/logo.svg" },
    alternates: { canonical: "/" },
    openGraph: {
      siteName: config.title,
      url: "/",
      title: metaTitle,
      description: metaDescription,
      images: [{ url: "/opengraph.png", width: 1200, height: 630 }],
      locale: "en_US",
      type: "website",
    },
  }

  return merge(customMetadata, metadata, { arrayMerge: (_, sourceArray) => sourceArray })
}
