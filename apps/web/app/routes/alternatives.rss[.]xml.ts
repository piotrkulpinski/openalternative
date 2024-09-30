import RSS from "rss"
import { prisma } from "~/services.server/prisma"
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "~/utils/constants"
import { addUTMTracking } from "~/utils/helpers"

export const loader = async () => {
  const alternatives = await prisma.alternative.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, slug: true, description: true, createdAt: true },
    take: 50,
  })

  const feed = new RSS({
    title: SITE_NAME,
    description: SITE_TAGLINE,
    site_url: addUTMTracking(`${SITE_URL}/alternatives`, { source: "rss" }),
    feed_url: `${SITE_URL}/alternatives/rss.xml`,
    copyright: `${new Date().getFullYear()} ${SITE_NAME}`,
    language: "en",
    ttl: 14400,
    pubDate: new Date(),
  })

  alternatives.map(alternative => {
    feed.item({
      guid: alternative.id,
      title: alternative.name,
      url: addUTMTracking(`${SITE_URL}/alternatives/${alternative.slug}`, { source: "rss" }),
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
