import { ToolStatus } from "@prisma/client"
import RSS from "rss"
import { config } from "~/config"
import { prisma } from "~/services/prisma"
import { addUTMTracking } from "~/utils/helpers"

export async function GET() {
  const { url, name, tagline } = config.site

  const tools = await prisma.tool.findMany({
    where: { status: ToolStatus.Published },
    orderBy: { publishedAt: "desc" },
    take: 50,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      publishedAt: true,
      categories: { include: { category: true } },
    },
  })

  const feed = new RSS({
    title: name,
    description: tagline,
    site_url: addUTMTracking(url, { source: "rss" }),
    feed_url: `${url}/rss/tools.xml`,
    copyright: `${new Date().getFullYear()} ${name}`,
    language: "en",
    ttl: 14400,
    pubDate: new Date(),
  })

  tools.map(tool => {
    feed.item({
      guid: tool.id,
      title: tool.name,
      url: addUTMTracking(`${url}/${tool.slug}`, { source: "rss" }),
      date: tool.publishedAt?.toUTCString() ?? new Date().toUTCString(),
      description: tool.description ?? "",
      categories: tool.categories?.map(c => c.category.name) || [],
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
