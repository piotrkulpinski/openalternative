import { ToolStatus } from "@openalternative/db/client"
import { NonRetriableError } from "inngest"
import { revalidateTag } from "next/cache"
import { getPageAnalytics } from "~/lib/analytics"
import { getMilestoneReached } from "~/lib/milestones"
import { getToolRepositoryData } from "~/lib/repositories"
import { getPostMilestoneTemplate, getPostTemplate, sendSocialPost } from "~/lib/socials"
import { isToolPublished } from "~/lib/tools"
import { inngest } from "~/services/inngest"
import { tryCatch } from "~/utils/helpers"

export const fetchTools = inngest.createFunction(
  { id: "fetch-tools", retries: 0 },
  { cron: "TZ=Europe/Warsaw 0 0 * * *" }, // Every day at midnight

  async ({ step, db, logger }) => {
    const tools = await step.run("fetch-tools", async () => {
      return await db.tool.findMany({
        where: { status: { in: [ToolStatus.Published, ToolStatus.Scheduled] } },
      })
    })

    await step.run("fetch-repository-data", async () => {
      const results = await Promise.allSettled(
        tools.map(async tool => {
          const [repoResult, analyticsResult] = await Promise.all([
            tryCatch(getToolRepositoryData(tool.repositoryUrl)),
            tryCatch(getPageAnalytics(`/${tool.slug}`)),
          ])

          if (repoResult.error) {
            logger.error(`Failed to fetch repository data for ${tool.name}`, {
              error: repoResult.error,
              repositoryUrl: tool.repositoryUrl,
            })
            return null
          }

          if (analyticsResult.error) {
            logger.error(`Failed to fetch analytics for ${tool.name}`, {
              error: analyticsResult.error,
              slug: tool.slug,
            })
          }

          const updatedTool = repoResult.data
          const pageviews = analyticsResult.data?.pageviews ?? tool.pageviews ?? 0

          if (!updatedTool) {
            logger.warn(`Skipping update for ${tool.name} due to missing repository data`)
            return null
          }

          logger.info(`Processing tool update for ${tool.name}`, {
            currentStars: tool.stars,
            newStars: updatedTool.stars,
            pageviews,
          })

          if (isToolPublished(tool) && updatedTool.stars > tool.stars) {
            const milestone = getMilestoneReached(tool.stars, updatedTool.stars)

            if (milestone) {
              const template = getPostMilestoneTemplate(tool, milestone)
              const socialResult = await tryCatch(sendSocialPost(template, tool))

              if (socialResult.error) {
                logger.error(`Failed to post milestone for ${tool.name}`, {
                  error: socialResult.error,
                  milestone,
                })
                throw new NonRetriableError(
                  `Social post failed: ${socialResult.error instanceof Error ? socialResult.error.message : "Unknown error"}`,
                )
              }

              logger.info(`Posted milestone update for ${tool.name}`, { milestone })
            }
          }

          const dbResult = await tryCatch(
            db.tool.update({
              where: { id: tool.id },
              data: { ...updatedTool, pageviews },
            }),
          )

          if (dbResult.error) {
            logger.error(`Failed to update tool ${tool.name} in database`, {
              error: dbResult.error,
            })
            return null
          }

          return dbResult.data
        }),
      )

      const successCount = results.filter(r => r.status === "fulfilled" && r.value).length
      const failureCount = results.length - successCount

      logger.info("Completed tool updates", {
        total: results.length,
        successful: successCount,
        failed: failureCount,
      })

      return results
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
    })
  },
)
