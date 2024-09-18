import { getMilestoneReached, sendMilestoneTweet } from "~/lib/milestones"
import { getRepositoryData } from "~/lib/repositories"
import { inngest } from "~/services/inngest"
import { prisma } from "~/services/prisma"

export const fetchToolData = inngest.createFunction(
  { id: "fetch-tool-data" },
  { cron: "TZ=Europe/Warsaw 0 0 * * *" },

  async ({ step, logger }) => {
    const tools = await step.run("fetch-tools", async () => {
      return prisma.tool.findMany({
        where: { publishedAt: { not: null } },
        select: {
          id: true,
          name: true,
          slug: true,
          repository: true,
          stars: true,
          bump: true,
          twitterHandle: true,
        },
      })
    })

    await step.run("fetch-repository-data", async () => {
      return Promise.all(
        tools.map(async tool => {
          const updatedTool = await getRepositoryData(tool)
          // logger.info(`Updated tool data for ${tool.name}`, { updatedTool })

          if (!updatedTool) {
            return null
          }

          const milestone = getMilestoneReached(tool.stars, updatedTool.stars)

          if (milestone) {
            const tweetName = tool.twitterHandle ? `@${tool.twitterHandle}` : tool.name
            // logger.info(`Sending milestone tweet for ${tool.name}`, { milestone })
            await sendMilestoneTweet(milestone, tweetName, tool.slug)
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
      // return indexSearch()
    })

    // Disconnect from DB
    await step.run("disconnect-from-db", async () => {
      return prisma.$disconnect()
    })
  },
)
