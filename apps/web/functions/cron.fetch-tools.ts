import { ToolStatus } from "@openalternative/db/client"
import { NonRetriableError } from "inngest"
import { revalidateTag } from "next/cache"
import { getMilestoneReached } from "~/lib/milestones"
import { getToolRepositoryData } from "~/lib/repositories"
import { getPostMilestoneTemplate, getPostTemplate, sendSocialPost } from "~/lib/socials"
import { isToolPublished } from "~/lib/tools"
import { findRandomTool } from "~/server/web/tools/queries"
import { inngest } from "~/services/inngest"

export const fetchTools = inngest.createFunction(
  { id: "fetch-tools", retries: 1 },
  { cron: "TZ=Europe/Warsaw 0 0 * * *" }, // Every day at midnight

  async ({ step, db, logger }) => {
    const tools = await step.run("fetch-tools", async () => {
      return await db.tool.findMany({
        where: { status: { in: [ToolStatus.Published, ToolStatus.Scheduled] } },
      })
    })

    await step.run("fetch-repository-data", async () => {
      return await Promise.all(
        tools.map(async tool => {
          const updatedTool = await getToolRepositoryData(tool.repositoryUrl)
          logger.info(`Updated tool data for ${tool.name}`, { updatedTool })

          if (!updatedTool) {
            return null
          }

          if (isToolPublished(tool) && updatedTool.stars > tool.stars) {
            const milestone = getMilestoneReached(tool.stars, updatedTool.stars)

            if (milestone) {
              const template = getPostMilestoneTemplate(tool, milestone)

              await sendSocialPost(template, tool).catch(err => {
                throw new NonRetriableError(err.message)
              })
            }
          }

          return db.tool.update({
            where: { id: tool.id },
            data: updatedTool,
          })
        }),
      )
    })

    // Post on Socials about a random tool
    await step.run("post-on-socials", async () => {
      const tool = await findRandomTool()

      if (tool) {
        const template = await getPostTemplate(tool)

        return await sendSocialPost(template, tool).catch(err => {
          throw new NonRetriableError(err.message)
        })
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
    })
  },
)
