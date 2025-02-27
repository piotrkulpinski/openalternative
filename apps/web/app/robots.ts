import type { MetadataRoute } from "next"
import { config } from "~/config"

export default function Robots(): MetadataRoute.Robots {
  const { url } = config.site

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/*", "/auth/*"],
    },
    host: url,
    sitemap: `${url}/sitemap.xml`,
  }
}
