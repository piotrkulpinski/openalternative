import { prisma } from "~/services.server/prisma"

export const loader = async () => {
  const url = import.meta.env.VITE_SITE_URL ?? ""

  const tools = await prisma.tool.findMany({
    where: { isDraft: false },
    orderBy: { createdAt: "asc" },
    select: { slug: true, updatedAt: true },
  })

  const categories = await prisma.category.findMany({ select: { slug: true } })
  const alternatives = await prisma.alternative.findMany({ select: { slug: true } })
  const languages = await prisma.language.findMany({ select: { slug: true } })
  const topics = await prisma.topic.findMany({ select: { slug: true } })

  const toolItems = tools.map((tool) => {
    return `
      <url>
        <loc>${url}/${tool.slug}</loc>
        <lastmod>${tool.updatedAt.toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1</priority>
      </url>
    `
  })

  const categoryItems = categories.map((category) => {
    return `
      <url>
        <loc>${url}/categories/${category.slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
    `
  })

  const alternativeItems = alternatives.map((alternative) => {
    return `
      <url>
        <loc>${url}/alternatives/${alternative.slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
    `
  })

  const languageItems = languages.map((language) => {
    return `
      <url>
        <loc>${url}/languages/${language.slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
    `
  })

  const topicItems = topics.map((topic) => {
    return `
      <url>
        <loc>${url}/topics/${topic.slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
    `
  })

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${url}</loc>
        <changefreq>daily</changefreq>
      </url>
      <url>
        <loc>${url}/about</loc>
        <changefreq>weekly</changefreq>
      </url>
      <url>
        <loc>${url}/submit</loc>
        <changefreq>weekly</changefreq>
      </url>
      ${toolItems.join("/n")}
      ${categoryItems.join("/n")}
      ${alternativeItems.join("/n")}
      ${languageItems.join("/n")}
      ${topicItems.join("/n")}
    </urlset>`

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=14400",
    },
  })
}
