import { indexSearch } from "~/actions/algolia"
import { getMilestoneReached, sendMilestoneTweet } from "~/lib/milestones"
import { getToolRepositoryData } from "~/lib/repositories"
import { inngest } from "~/services/inngest"
import { prisma } from "~/services/prisma"

export const fetchToolData = inngest.createFunction(
  { id: "fetch-tool-data" },
  { cron: "TZ=Europe/Warsaw 0 0 * * *" },

  async ({ step, logger }) => {
    const tools = await step.run("fetch-tools", async () => {
      return prisma.tool.findMany({
        where: { publishedAt: { not: null } },
      })
    })

    await step.run("fetch-repository-data", async () => {
      return Promise.all(
        tools.map(async tool => {
          const updatedTool = await getToolRepositoryData(tool)
          logger.info(`Updated tool data for ${tool.name}`, { updatedTool })

          if (!updatedTool) {
            return null
          }

          const milestone = getMilestoneReached(tool.stars, updatedTool.stars)

          if (milestone) {
            logger.info(`Sending milestone tweet for ${tool.name}`, { milestone })
            await sendMilestoneTweet(milestone, tool)
          }

          return prisma.tool.update({
            where: { id: tool.id },
            data: updatedTool,
          })
        }),
      )
    })

    // Index search for Algolia
    await step.run("index-search", async () => {
      return indexSearch()
    })

    // Disconnect from DB
    await step.run("disconnect-from-db", async () => {
      return prisma.$disconnect()
    })
  },
)
