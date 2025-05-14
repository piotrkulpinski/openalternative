import { millisecondsInMinute } from "date-fns/constants"
import { config } from "~/config"
import { alternativeOnePayload } from "~/server/web/alternatives/payloads"
import { categoryOnePayload } from "~/server/web/categories/payloads"
import { toolOnePayload } from "~/server/web/tools/payloads"
import { inngest } from "~/services/inngest"
import { getMeilisearchIndex } from "~/services/meilisearch"

export const indexData = inngest.createFunction(
  { id: `${config.site.slug}.index-data`, retries: 0 },
  { cron: "TZ=Europe/Warsaw */15 * * * *" }, // Every 15 minutes

  async ({ step, db, logger }) => {
    const timeThreshold = new Date(Date.now() - 15 * millisecondsInMinute)

    await Promise.all([
      step.run("index-tools", async () => {
        const tools = await db.tool.findMany({
          where: { status: "Published", updatedAt: { gte: timeThreshold } },
          select: toolOnePayload,
        })

        if (tools.length) {
          const { taskUid } = await getMeilisearchIndex("tools").addDocuments(
            tools.map(tool => ({
              id: tool.id,
              name: tool.name,
              slug: tool.slug,
              tagline: tool.tagline,
              description: tool.description,
              websiteUrl: tool.websiteUrl,
              faviconUrl: tool.faviconUrl,
              alternatives: tool.alternatives?.map(a => a.name) ?? [],
              categories: tool.categories?.map(c => c.name) ?? [],
              topics: tool.topics?.map(t => t.slug) ?? [],
            })),
          )

          logger.info(`Indexed ${tools.length} tools. TaskUid: ${taskUid}`)
        }
      }),

      step.run("index-alternatives", async () => {
        const alternatives = await db.alternative.findMany({
          where: { updatedAt: { gte: timeThreshold } },
          select: alternativeOnePayload,
        })

        if (alternatives.length) {
          const { taskUid } = await getMeilisearchIndex("alternatives").addDocuments(
            alternatives.map(alternative => ({
              id: alternative.id,
              name: alternative.name,
              slug: alternative.slug,
              description: alternative.description,
              websiteUrl: alternative.websiteUrl,
              faviconUrl: alternative.faviconUrl,
            })),
          )

          logger.info(`Indexed ${alternatives.length} alternatives. TaskUid: ${taskUid}`)
        }
      }),

      step.run("index-categories", async () => {
        const categories = await db.category.findMany({
          where: { updatedAt: { gte: timeThreshold } },
          select: categoryOnePayload,
        })

        if (categories.length) {
          const { taskUid } = await getMeilisearchIndex("categories").addDocuments(
            categories.map(category => ({
              id: category.id,
              name: category.name,
              slug: category.slug,
              description: category.description,
              fullPath: category.fullPath,
            })),
          )

          logger.info(`Indexed ${categories.length} categories. TaskUid: ${taskUid}`)
        }
      }),
    ])

    // Disconnect from DB
    await step.run("disconnect-from-db", async () => {
      return await db.$disconnect()
    })
  },
)
