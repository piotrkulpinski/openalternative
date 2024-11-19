import type { MetadataRoute } from "next"
import { allPosts as posts } from "~/.content-collections/generated"
import { config } from "~/config"
import { findAlternativeSlugs } from "~/server/alternatives/queries"
import { findCategorySlugs } from "~/server/categories/queries"
import { findLanguageSlugs } from "~/server/languages/queries"
import { findLicenseSlugs } from "~/server/licenses/queries"
import { findToolSlugs } from "~/server/tools/queries"
import { findTopicSlugs } from "~/server/topics/queries"

type Entry = MetadataRoute.Sitemap[number]

const createEntry = (path: string, lastModified: Date, options?: Partial<Entry>): Entry => ({
  url: `${config.site.url}${path}`,
  lastModified,
  changeFrequency: "weekly",
  ...options,
})

export default async function Sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tools, categories, alternatives, languages, topics, licenses] = await Promise.all([
    findToolSlugs({}),
    findCategorySlugs({}),
    findAlternativeSlugs({}),
    findLanguageSlugs({}),
    findTopicSlugs({}),
    findLicenseSlugs({}),
  ])

  const pages = ["/about", "/advertise", "/submit", "/newsletter"]
  const now = new Date()

  return [
    // Home
    createEntry("", now, { changeFrequency: "daily", priority: 1 }),

    // Static pages
    ...pages.map(page => createEntry(page, now, { changeFrequency: "monthly" })),

    // Posts
    createEntry("/blog", now),
    ...posts.map(post =>
      createEntry(`/blog/${post._meta.path}`, new Date(post.updatedAt ?? post.publishedAt)),
    ),

    // Tools
    createEntry("/tools", now),
    ...tools.map(tool => createEntry(`/${tool.slug}`, tool.updatedAt)),

    // Categories
    createEntry("/categories", now),
    ...categories.map(cat => createEntry(`/categories/${cat.slug}`, cat.updatedAt)),

    // Alternatives
    createEntry("/alternatives", now),
    ...alternatives.map(alt => createEntry(`/alternatives/${alt.slug}`, alt.updatedAt)),

    // Languages
    createEntry("/languages", now),
    ...languages.map(lang => createEntry(`/languages/${lang.slug}`, lang.updatedAt)),

    // Topics
    createEntry("/topics", now),
    ...config.site.alphabet.split("").map(letter => createEntry(`/topics/letter/${letter}`, now)),
    ...topics.map(topic => createEntry(`/topics/${topic.slug}`, topic.updatedAt)),

    // Licenses
    createEntry("/licenses", now),
    ...licenses.flatMap(license => [
      createEntry(`/licenses/${license.slug}`, license.updatedAt, { changeFrequency: "monthly" }),
      createEntry(`/licenses/${license.slug}/tools`, license.updatedAt),
    ]),
  ]
}
