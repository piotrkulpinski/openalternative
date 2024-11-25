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
    ...pages.map(p => createEntry(p, now, { changeFrequency: "monthly" })),

    // Posts
    createEntry("/blog", now),
    ...posts.map(p => createEntry(`/blog/${p._meta.path}`, new Date(p.updatedAt ?? p.publishedAt))),

    // Tools
    ...tools.map(t => createEntry(`/${t.slug}`, t.updatedAt)),

    // Categories
    createEntry("/categories", now),
    ...categories.map(c => createEntry(`/categories/${c.slug}`, c.updatedAt)),

    // Alternatives
    createEntry("/alternatives", now),
    ...alternatives.map(a => createEntry(`/alternatives/${a.slug}`, a.updatedAt)),

    // Languages
    createEntry("/languages", now),
    ...languages.map(l => createEntry(`/languages/${l.slug}`, l.updatedAt)),

    // Topics
    ...config.site.alphabet.split("").map(letter => createEntry(`/topics/letter/${letter}`, now)),
    ...topics.map(t => createEntry(`/topics/${t.slug}`, t.updatedAt)),

    // Licenses
    createEntry("/licenses", now),
    ...licenses.flatMap(l => [
      createEntry(`/licenses/${l.slug}`, l.updatedAt, { changeFrequency: "monthly" }),
      createEntry(`/licenses/${l.slug}/tools`, l.updatedAt),
    ]),
  ]
}
