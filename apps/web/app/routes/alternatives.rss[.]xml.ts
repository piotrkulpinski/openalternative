import { prisma } from "~/services.server/prisma"
import { SITE_NAME, SITE_TAGLINE } from "~/utils/constants"
import { addUTMTracking } from "~/utils/helpers"

export const loader = async () => {
  const url = import.meta.env.NEXT_PUBLIC_SITE_URL ?? ""

  const alternatives = await prisma.alternative.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, slug: true, description: true, createdAt: true },
    take: 50,
  })

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${SITE_NAME}</title>
      <description>${SITE_TAGLINE}</description>
      <link>${addUTMTracking(`${url}/alternatives`, { source: "rss" })}</link>
      <language>en-us</language>
      <ttl>60</ttl>
      <atom:link href="${url}/alternatives/rss.xml" rel="self" type="application/rss+xml" />
      ${alternatives
        .map(
          alternative => `
      <item>
        <title><![CDATA[${alternative.name}]]></title>
        <description><![CDATA[${alternative.description}]]></description>
        <pubDate>${alternative.createdAt?.toUTCString()}</pubDate>
        <link>${addUTMTracking(`${url}/alternatives/${alternative.slug}`, { source: "rss" })}</link>
        <guid isPermaLink="false">${alternative.id}</guid>
      </item>`,
        )
        .join("\n")}
    </channel>
  </rss>`

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=14400",
    },
  })
}
