import type { MetadataRoute } from "next"
import { config } from "~/config"
import { findCategorySlugs } from "~/server/categories/queries"
import { findCollectionSlugs } from "~/server/collections/queries"
import { findTagSlugs } from "~/server/tags/queries"
import { findToolSlugs } from "~/server/tools/queries"

export default async function Sitemap(): Promise<MetadataRoute.Sitemap> {
  const { url } = config.site

  const [tools, categories, collections, tags] = await Promise.all([
    findToolSlugs({}),
    findCategorySlugs({}),
    findCollectionSlugs({}),
    findTagSlugs({}),
  ])

  return [
    {
      url: url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${url}/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },

    // Tools
    {
      url: `${url}/tools`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
    ...tools.map(
      tool =>
        ({
          url: `${url}/tools/${tool.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        }) as const,
    ),

    // Categories
    {
      url: `${url}/categories`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
    ...categories.map(
      category =>
        ({
          url: `${url}/categories/${category.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        }) as const,
    ),

    // Collections
    {
      url: `${url}/collections`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
    ...collections.map(
      collection =>
        ({
          url: `${url}/collections/${collection.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        }) as const,
    ),

    // Tags
    {
      url: `${url}/tags`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
    ...tags.map(
      tag =>
        ({
          url: `${url}/tags/${tag.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        }) as const,
    ),
  ]
}
