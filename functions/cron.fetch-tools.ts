import { ToolStatus } from "@prisma/client"
import { unstable_expireTag as expireTag } from "next/cache"
import { getMilestoneReached, sendMilestonePost } from "~/lib/milestones"
import { getToolRepositoryData } from "~/lib/repositories"
import { generateSocialPost } from "~/lib/socials"
import { isToolPublished } from "~/lib/tools"
import { sendBlueskyPost } from "~/services/bluesky"
import { inngest } from "~/services/inngest"
import { prisma } from "~/services/prisma"
import { sendTwitterPost } from "~/services/twitter"

export const fetchTools = inngest.createFunction(
  { id: "fetch-tools" },
  { cron: "TZ=Europe/Warsaw 0 0 * * *" },

  async ({ step, logger }) => {
    const tools = await step.run("fetch-tools", async () => {
      return prisma.tool.findMany({
        where: { status: { in: [ToolStatus.Published, ToolStatus.Scheduled] } },
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
            milestone && (await sendMilestonePost(milestone, tool))
          }

          return prisma.tool.update({
            where: { id: tool.id },
            data: updatedTool,
          })
        }),
      )
    })

    // Post on Socials about a random tool
    await step.run("post-on-socials", async () => {
      const post = await generateSocialPost()

      if (post) {
        await sendTwitterPost(post)
        await sendBlueskyPost(post)
      }
    })

    // Disconnect from DB
    await step.run("disconnect-from-db", async () => {
      return prisma.$disconnect()
    })

    // Expire cache
    await step.run("expire-tags", async () => {
      expireTag("tools", "tool")
    })
  },
)
