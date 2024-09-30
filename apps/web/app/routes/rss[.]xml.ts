import RSS from "rss"
import { prisma } from "~/services.server/prisma"
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "~/utils/constants"
import { addUTMTracking } from "~/utils/helpers"

export const loader = async () => {
  const tools = await prisma.tool.findMany({
    where: { publishedAt: { lte: new Date() } },
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
    title: SITE_NAME,
    description: SITE_TAGLINE,
    site_url: addUTMTracking(SITE_URL, { source: "rss" }),
    feed_url: `${SITE_URL}/rss.xml`,
    copyright: `${new Date().getFullYear()} ${SITE_NAME}`,
    language: "en",
    ttl: 14400,
    pubDate: new Date(),
  })

  tools.map(tool => {
    feed.item({
      guid: tool.id,
      title: tool.name,
      url: addUTMTracking(`${SITE_URL}/${tool.slug}`, { source: "rss" }),
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
