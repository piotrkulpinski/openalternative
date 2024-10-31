import { indexSearch } from "~/actions/algolia"
import { getMilestoneReached, sendMilestoneTweet } from "~/lib/milestones"
import { getToolRepositoryData } from "~/lib/repositories"
import { generateSocialTweet } from "~/lib/socials"
import { isToolPublished } from "~/lib/tools"
import { inngest } from "~/services/inngest"
import { prisma } from "~/services/prisma"
import { sendTweet } from "~/services/twitter"

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

          if (isToolPublished(tool) && updatedTool.stars > tool.stars) {
            const milestone = getMilestoneReached(tool.stars, updatedTool.stars)
            milestone && (await sendMilestoneTweet(milestone, tool))
          }

          return prisma.tool.update({
            where: { id: tool.id },
            data: updatedTool,
          })
        }),
      )
    })

    // Post on Twitter about a random tool
    await step.run("post-on-twitter", async () => {
      const tweet = await generateSocialTweet()
      return tweet ? await sendTweet(tweet) : null
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
