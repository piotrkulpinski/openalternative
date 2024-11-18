import RSS from "rss"
import { config } from "~/config"
import { prisma } from "~/services/prisma"
import { addUTMTracking } from "~/utils/helpers"

export async function GET() {
  const { url, name, tagline } = config.site

  const tools = await prisma.tool.findMany({
    where: { publishedAt: { lte: new Date() } },
    orderBy: { publishedAt: "desc" },
    select: { name: true, slug: true, description: true, publishedAt: true, categories: true },
    take: 50,
  })

  const feed = new RSS({
    title: name,
    description: tagline,
    site_url: addUTMTracking(url, { source: "rss" }),
    feed_url: `${url}/rss.xml`,
    copyright: `${new Date().getFullYear()} ${name}`,
    language: "en",
    ttl: 14400,
    pubDate: new Date(),
  })

  tools.map(tool => {
    feed.item({
      title: tool.name,
      guid: tool.slug,
      url: addUTMTracking(`${url}/tools/${tool.slug}`, { source: "rss" }),
      date: tool.publishedAt ?? new Date(),
      description: tool.description ?? "",
      categories: tool.categories?.map(c => c.name) || [],
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
