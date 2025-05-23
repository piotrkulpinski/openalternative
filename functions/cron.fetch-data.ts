import { ToolStatus } from "@prisma/client"
import { NonRetriableError } from "inngest"
import { revalidateTag } from "next/cache"
import { config } from "~/config"
import { fetchAnalyticsInBatches } from "~/lib/analytics"
import { getMilestoneReached } from "~/lib/milestones"
import { recalculatePrices } from "~/lib/pricing"
import { getToolRepositoryData } from "~/lib/repositories"
import { getPostMilestoneTemplate, getPostTemplate, sendSocialPost } from "~/lib/socials"
import { isToolPublished } from "~/lib/tools"
import { inngest } from "~/services/inngest"
import { tryCatch } from "~/utils/helpers"

export const fetchData = inngest.createFunction(
  { id: `${config.site.slug}.fetch-data`, retries: 0 },
  { cron: "TZ=Europe/Warsaw 0 0 * * *" }, // Every day at midnight

  async ({ step, db, logger }) => {
    const [tools, alternatives] = await Promise.all([
      step.run("fetch-tools", async () => {
        return await db.tool.findMany({
          where: { status: { in: [ToolStatus.Published, ToolStatus.Scheduled] } },
        })
      }),

      step.run("fetch-alternatives", async () => {
        return await db.alternative.findMany()
      }),
    ])

    await Promise.all([
      // Fetch repository data and handle milestones
      step.run("fetch-repository-data", async () => {
        return await Promise.allSettled(
          tools.map(async tool => {
            const result = await tryCatch(getToolRepositoryData(tool.repositoryUrl))

            if (result.error) {
              logger.error(`Failed to fetch repository data for ${tool.name}`, {
                error: result.error,
                slug: tool.slug,
              })

              return null
            }

            if (!result.data) {
              return null
            }

            if (isToolPublished(tool) && result.data.stars > tool.stars) {
              const milestone = getMilestoneReached(tool.stars, result.data.stars)

              if (milestone) {
                const template = getPostMilestoneTemplate(tool, milestone)
                await sendSocialPost(template, tool)
              }
            }

            await db.tool.update({
              where: { id: tool.id },
              data: result.data,
            })
          }),
        )
      }),

      // Fetch tool analytics data
      step.run("fetch-tool-analytics-data", async () => {
        await fetchAnalyticsInBatches({
          data: tools.filter(isToolPublished),
          pathPrefix: "/",
          logger,
          onSuccess: async (id, data) => {
            await db.tool.update({ where: { id }, data })
          },
        })
      }),

      // Fetch alternative analytics data
      step.run("fetch-alternative-analytics-data", async () => {
        await fetchAnalyticsInBatches({
          data: alternatives,
          pathPrefix: "/alternatives/",
          logger,
          onSuccess: async (id, data) => {
            await db.alternative.update({ where: { id }, data })
          },
        })
      }),
    ])

    // Calculate advertising prices based on pageviews
    await step.run("calculate-alternative-prices", async () => {
      const alternatives = await db.alternative.findMany()

      await recalculatePrices(alternatives, async ({ id, adPrice }) => {
        await db.alternative.update({ where: { id }, data: { adPrice } })
      })
    })

    // Post on Socials about a random tool
    await step.run("post-on-socials", async () => {
      const publishedTools = tools.filter(isToolPublished)
      const tool = publishedTools[Math.floor(Math.random() * publishedTools.length)]

      if (tool) {
        const template = await getPostTemplate(tool)
        const result = await tryCatch(sendSocialPost(template, tool))

        if (result.error) {
          throw new NonRetriableError(
            result.error instanceof Error ? result.error.message : "Unknown error",
          )
        }

        return result.data
      }
    })

    // Disconnect from DB
    await step.run("disconnect-from-db", async () => {
      return await db.$disconnect()
    })

    // Revalidate cache
    await step.run("revalidate-cache", async () => {
      revalidateTag("tools")
      revalidateTag("tool")
      revalidateTag("alternatives")
    })
  },
)
