import type { MetadataRoute } from "next"
import { config } from "~/config"

export default function Robots(): MetadataRoute.Robots {
  const { url } = config.site

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/*", "/login"],
    },
    host: url,
    sitemap: `${url}/sitemap.xml`,
  }
}
