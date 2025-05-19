import type { AlternativeOne } from "~/server/web/alternatives/payloads"
import type { CategoryOne } from "~/server/web/categories/payloads"
import type { ToolOne } from "~/server/web/tools/payloads"
import { getMeiliIndex } from "~/services/meilisearch"

/**
 * Index tools in MeiliSearch
 * @param tools
 * @returns Enqueued task
 */
export const indexTools = async (tools: ToolOne[]) => {
  return await getMeiliIndex("tools").addDocuments(
    tools.map(tool => ({
      id: tool.id,
      name: tool.name,
      slug: tool.slug,
      tagline: tool.tagline,
      description: tool.description,
      websiteUrl: tool.websiteUrl,
      faviconUrl: tool.faviconUrl,
      status: tool.status,
      alternatives: tool.alternatives?.map(a => a.name) ?? [],
      categories: tool.categories?.map(c => c.name) ?? [],
      topics: tool.topics?.map(t => t.slug) ?? [],
    })),
  )
}

/**
 * Index alternatives in MeiliSearch
 * @param alternatives
 * @returns Enqueued task
 */
export const indexAlternatives = async (alternatives: AlternativeOne[]) => {
  return await getMeiliIndex("alternatives").addDocuments(
    alternatives.map(alternative => ({
      id: alternative.id,
      name: alternative.name,
      slug: alternative.slug,
      description: alternative.description,
      websiteUrl: alternative.websiteUrl,
      faviconUrl: alternative.faviconUrl,
    })),
  )
}

/**
 * Index categories in MeiliSearch
 * @param categories
 * @returns Enqueued task
 */
export const indexCategories = async (categories: CategoryOne[]) => {
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
