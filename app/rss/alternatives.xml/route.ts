import { getUrlHostname } from "@primoui/utils"
import { ToolStatus } from "@prisma/client"
import RSS from "rss"
import { config } from "~/config"
import { db } from "~/services/db"
import { addSearchParams } from "~/utils/search-params"

export const GET = async () => {
  const { url, name, tagline } = config.site
  const rssSearchParams = { utm_source: getUrlHostname(url), utm_medium: "rss" }

  const alternatives = await db.alternative.findMany({
    where: { tools: { some: { status: ToolStatus.Published } } },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      createdAt: true,
    },
  })

  const feed = new RSS({
    title: name,
    description: tagline,
    site_url: addSearchParams(`${url}/alternatives`, rssSearchParams),
    feed_url: `${url}/rss/alternatives.xml`,
    copyright: `${new Date().getFullYear()} ${name}`,
    language: "en",
    ttl: 14400,
    pubDate: new Date(),
  })

  alternatives.map(alternative => {
    feed.item({
      guid: alternative.id,
      title: alternative.name,
      url: addSearchParams(`${url}/alternatives/${alternative.slug}`, rssSearchParams),
      date: alternative.createdAt.toUTCString(),
      description: alternative.description ?? "",
    })
  })

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/xml",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=14400",
    },
  })
}
