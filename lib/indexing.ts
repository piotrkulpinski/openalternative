import { type Prisma, ToolStatus } from "@prisma/client"
import {
  toolAlternativesPayload,
  toolCategoriesPayload,
  toolTopicsPayload,
} from "~/server/web/tools/payloads"
import { db } from "~/services/db"
import { getMeiliIndex } from "~/services/meilisearch"

/**
 * Index tools in MeiliSearch
 * @returns Enqueued task
 */
export const indexTools = async ({ where }: { where?: Prisma.ToolWhereInput }) => {
  const tools = await db.tool.findMany({
    where: { status: { in: [ToolStatus.Scheduled, ToolStatus.Published] }, ...where },
    include: {
      alternatives: toolAlternativesPayload,
      categories: toolCategoriesPayload,
      topics: toolTopicsPayload,
    },
  })

  if (!tools.length) return

  return await getMeiliIndex("tools").addDocuments(
    tools.map(tool => ({
      id: tool.id,
      name: tool.name,
      slug: tool.slug,
      tagline: tool.tagline,
      description: tool.description,
      websiteUrl: tool.websiteUrl,
      faviconUrl: tool.faviconUrl,
      isFeatured: tool.isFeatured,
      score: tool.score,
      pageviews: tool.pageviews,
      status: tool.status,
      alternatives: tool.alternatives.map(a => a.name),
      categories: tool.categories.map(c => c.name),
      topics: tool.topics.map(t => t.slug),
    })),
  )
}

/**
 * Index alternatives in MeiliSearch
 * @returns Enqueued task
 */
export const indexAlternatives = async ({ where }: { where?: Prisma.AlternativeWhereInput }) => {
  const alternatives = await db.alternative.findMany({ where })

  if (!alternatives.length) return

  return await getMeiliIndex("alternatives").addDocuments(
    alternatives.map(alternative => ({
      id: alternative.id,
      name: alternative.name,
      slug: alternative.slug,
      description: alternative.description,
      websiteUrl: alternative.websiteUrl,
      faviconUrl: alternative.faviconUrl,
      pageviews: alternative.pageviews,
    })),
  )
}

/**
 * Index categories in MeiliSearch
 * @param categories
 * @returns Enqueued task
 */
export const indexCategories = async ({ where }: { where?: Prisma.CategoryWhereInput }) => {
  const categories = await db.category.findMany({ where })

  if (!categories.length) return

  return await getMeiliIndex("categories").addDocuments(
    categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      fullPath: category.fullPath,
    })),
  )
}
