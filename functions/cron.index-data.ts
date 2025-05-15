import { ToolStatus } from "@prisma/client"
import { millisecondsInMinute } from "date-fns/constants"
import { config } from "~/config"
import { indexAlternatives, indexCategories, indexTools } from "~/lib/indexing"
import { alternativeOnePayload } from "~/server/web/alternatives/payloads"
import { categoryOnePayload } from "~/server/web/categories/payloads"
import { toolOnePayload } from "~/server/web/tools/payloads"
import { inngest } from "~/services/inngest"

export const indexData = inngest.createFunction(
  { id: `${config.site.slug}.index-data`, retries: 0 },
  { cron: "TZ=Europe/Warsaw */15 * * * *" }, // Every 15 minutes

  async ({ step, db, logger }) => {
    const timeThreshold = new Date(Date.now() - 15 * millisecondsInMinute)

    await Promise.all([
      step.run("index-tools", async () => {
        const tools = await db.tool.findMany({
          where: { status: ToolStatus.Published, updatedAt: { gte: timeThreshold } },
          select: toolOnePayload,
        })

        if (tools.length) {
          await indexTools(tools)
          logger.info(`Indexed ${tools.length} tools.`)
        }
      }),

      step.run("index-alternatives", async () => {
        const alternatives = await db.alternative.findMany({
          where: { updatedAt: { gte: timeThreshold } },
          select: alternativeOnePayload,
        })

        if (alternatives.length) {
          await indexAlternatives(alternatives)
          logger.info(`Indexed ${alternatives.length} alternatives.`)
        }
      }),

      step.run("index-categories", async () => {
        const categories = await db.category.findMany({
          where: { updatedAt: { gte: timeThreshold } },
          select: categoryOnePayload,
        })

        if (categories.length) {
          await indexCategories(categories)
          logger.info(`Indexed ${categories.length} categories.`)
        }
      }),
    ])

    // Disconnect from DB
    await step.run("disconnect-from-db", async () => {
      return await db.$disconnect()
    })
  },
)
