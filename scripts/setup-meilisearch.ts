import { config } from "~/config"
import { env } from "~/env"
import { indexAlternatives, indexCategories, indexTools } from "~/lib/indexing"
import { meili } from "~/services/meilisearch"

const siteSlug = config.site.slug

const indexes = [
  {
    name: "tools",
    primaryKey: "id",
    embedder: {
      source: "openAi",
      apiKey: env.OPENAI_API_KEY,
      model: "text-embedding-3-small",
      documentTemplate:
        'Tool: {{doc.name}}\nTagline: {{doc.tagline}}\nDescription: {{doc.description}}\nCategories: {{doc.categories | join: ", "}}\nAlternatives: {{doc.alternatives | join: ", "}}',
    },
    settings: {
      searchableAttributes: [
        "name",
        "tagline",
        "description",
        "categories",
        "alternatives",
        "topics",
      ],
      displayedAttributes: [
        "id",
        "name",
        "slug",
        "tagline",
        "description",
        "websiteUrl",
        "faviconUrl",
        "isFeatured",
        "score",
        "pageviews",
        "status",
        "alternatives",
        "categories",
        "topics",
      ],
      filterableAttributes: ["status", "isFeatured", "categories", "alternatives", "topics"],
      sortableAttributes: ["score", "pageviews", "isFeatured"],
      rankingRules: [
        "words",
        "typo",
        "proximity",
        "attribute",
        "sort",
        "exactness",
        "isFeatured:desc",
        "score:desc",
        "pageviews:desc",
      ],
      embedders: undefined, // will be set below
    },
  },
  {
    name: "alternatives",
    primaryKey: "id",
    embedder: {
      source: "openAi",
      apiKey: env.OPENAI_API_KEY,
      model: "text-embedding-3-small",
      documentTemplate: "Alternative: {{doc.name}}\nDescription: {{doc.description}}",
    },
    settings: {
      searchableAttributes: ["name", "description"],
      displayedAttributes: [
        "id",
        "name",
        "slug",
        "description",
        "websiteUrl",
        "faviconUrl",
        "pageviews",
      ],
      filterableAttributes: ["id", "name"],
      sortableAttributes: ["pageviews"],
      rankingRules: [
        "words",
        "typo",
        "proximity",
        "attribute",
        "sort",
        "exactness",
        "pageviews:desc",
      ],
      embedders: undefined, // will be set below
    },
  },
  {
    name: "categories",
    primaryKey: "id",
    embedder: {
      source: "openAi",
      apiKey: env.OPENAI_API_KEY,
      model: "text-embedding-3-small",
      documentTemplate:
        "Category: {{doc.name}}\nDescription: {{doc.description}}\nFull path: {{doc.fullPath}}",
    },
    settings: {
      searchableAttributes: ["name", "description", "fullPath"],
      displayedAttributes: ["id", "name", "slug", "description", "fullPath"],
      filterableAttributes: ["name", "fullPath"],
      sortableAttributes: [],
      rankingRules: ["words", "typo", "proximity", "attribute", "sort", "exactness"],
      embedders: undefined, // will be set below
    },
  },
]

async function cleanupIndexes() {
  for (const idx of indexes) {
    const indexUid = `${siteSlug}-${idx.name}`
    try {
      await meili.index(indexUid).delete()
      console.log(`Deleted existing index: ${indexUid}`)
    } catch (e: any) {
      if (e.code !== "index_not_found" && !e.message?.includes("not found")) {
        console.warn(`Could not delete index ${indexUid}:`, e.message)
      }
    }
  }
}

async function setupIndexes() {
  for (const idx of indexes) {
    const indexUid = `${siteSlug}-${idx.name}`
    // Create index
    await meili.createIndex(indexUid, { primaryKey: idx.primaryKey })
    // Set embedder (key must match what is used in search: 'openAi')
    const embedders = { openAi: idx.embedder } as any
    // Patch settings
    await meili.index(indexUid).updateSettings({
      ...idx.settings,
      embedders,
    })
    console.log(`Configured index: ${indexUid}`)
  }
}

async function reindexAll() {
  await Promise.all([indexTools({}), indexAlternatives({}), indexCategories({})])
  console.log("Reindexing complete.")
}

async function main() {
  await cleanupIndexes()
  await setupIndexes()
  await reindexAll()
  console.log("MeiliSearch setup and population complete.")
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
