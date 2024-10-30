import type { Prisma } from "@openalternative/db"
import { allPosts } from "content-collections"
import { prisma } from "~/services.server/prisma"

export const loader = async () => {
  const url = import.meta.env.NEXT_PUBLIC_SITE_URL ?? ""
  const toolWhere: Prisma.ToolWhereInput = { publishedAt: { lte: new Date() } }

  const [tools, categories, alternatives, languages, topics, licenses] = await prisma.$transaction([
    prisma.tool.findMany({
      where: toolWhere,
      orderBy: { createdAt: "asc" },
      select: { slug: true, updatedAt: true },
    }),

    prisma.category.findMany({
      where: { tools: { some: { tool: toolWhere } } },
      select: { slug: true },
    }),

    prisma.alternative.findMany({
      where: { tools: { some: { tool: toolWhere } } },
      select: { slug: true },
    }),

    prisma.language.findMany({
      where: { tools: { some: { tool: toolWhere } } },
      select: { slug: true },
    }),

    prisma.topic.findMany({
      where: { tools: { some: { tool: toolWhere } } },
      select: { slug: true },
    }),

    prisma.license.findMany({
      where: { tools: { some: toolWhere } },
      select: { slug: true },
    }),
  ])

  const postItems = allPosts.map(post => {
    return `
      <url>
        <loc>${url}/blog/${post._meta.path}</loc>
        <lastmod>${new Date(post.dateModified || post.datePublished).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1</priority>
      </url>
    `
  })

  const toolItems = tools.map(tool => {
    return `
      <url>
        <loc>${url}/${tool.slug}</loc>
        <lastmod>${tool.updatedAt.toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1</priority>
      </url>
    `
  })

  const categoryItems = categories.map(category => {
    return `
      <url>
        <loc>${url}/categories/${category.slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
    `
  })

  const alternativeItems = alternatives.map(alternative => {
    return `
      <url>
        <loc>${url}/alternatives/${alternative.slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
    `
  })

  const languageItems = languages.map(language => {
    return `
      <url>
        <loc>${url}/languages/${language.slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
    `
  })

  const topicItems = topics.map(topic => {
    return `
      <url>
        <loc>${url}/topics/${topic.slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
    `
  })

  const licensItems = licenses.map(license => {
    return `
      <url>
        <loc>${url}/licenses/${license.slug}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>
      <url>
        <loc>${url}/licenses/${license.slug}/tools</loc>
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
        <loc>${url}/blog</loc>
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
      <url>
        <loc>${url}/advertise</loc>
        <changefreq>weekly</changefreq>
      </url>
      ${postItems.join("\n")}
      ${toolItems.join("\n")}
      ${categoryItems.join("\n")}
      ${alternativeItems.join("\n")}
      ${languageItems.join("\n")}
      ${topicItems.join("\n")}
      ${licensItems.join("\n")}
    </urlset>`

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=14400",
    },
  })
}
