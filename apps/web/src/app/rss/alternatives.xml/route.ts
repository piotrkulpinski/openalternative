import { db } from "@openalternative/db"
import { ToolStatus } from "@openalternative/db/client"
import RSS from "rss"
import { config } from "~/config"
import { addUTMTracking } from "~/utils/helpers"

export async function GET() {
  const { url, name, tagline } = config.site

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
    site_url: addUTMTracking(`${url}/alternatives`, { source: "rss" }),
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
      url: addUTMTracking(`${url}/alternatives/${alternative.slug}`, { source: "rss" }),
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
