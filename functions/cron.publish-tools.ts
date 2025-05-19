import { type Tool, ToolStatus } from "@prisma/client"
import { NonRetriableError } from "inngest"
import { revalidateTag } from "next/cache"
import { config } from "~/config"
import { indexTools } from "~/lib/indexing"
import { notifySubmitterOfToolPublished } from "~/lib/notifications"
import { getPostLaunchTemplate, sendSocialPost } from "~/lib/socials"
import { type ToolOne, toolOnePayload } from "~/server/web/tools/payloads"
import { inngest } from "~/services/inngest"

export const publishTools = inngest.createFunction(
  { id: `${config.site.slug}.publish-tools` },
  { cron: "TZ=Europe/Warsaw */15 * * * *" }, // Every 15 minutes

  async ({ step, db, logger }) => {
    const tools = await step.run("fetch-tools", async () => {
      return await db.tool.findMany({
        where: { status: ToolStatus.Scheduled, publishedAt: { lte: new Date() } },
        select: toolOnePayload,
      })
    })

    if (tools.length) {
      logger.info(`Publishing ${tools.length} tools`, { tools })

      for (const tool of tools) {
        // Update tool status
        const updatedTool = await step.run(`update-tool-status-${tool.slug}`, async () => {
          return db.tool.update({
            where: { id: tool.id },
            data: { status: ToolStatus.Published },
          })
        })

        // Run steps in parallel
        await Promise.all([
          // Revalidate cache
          step.run("revalidate-cache", async () => {
            revalidateTag(`tool-${tool.slug}`)
          }),

          // Post on socials
          step.run(`post-on-socials-${tool.slug}`, async () => {
            const template = getPostLaunchTemplate(tool)

            return await sendSocialPost(template, tool).catch(err => {
              console.error(err)
              throw new NonRetriableError(err.message)
            })
          }),

          // Notify the submitter of the tool published
          step.run(`send-email-${tool.slug}`, async () => {
            return notifySubmitterOfToolPublished(updatedTool as unknown as Tool)
          }),
        ])
      }

      // Revalidate cache
      await step.run("revalidate-cache", async () => {
        revalidateTag("tools")
        revalidateTag("schedule")
      })
    }

    // Index tools
    await step.run("index-tools", async () => {
      await indexTools(tools as unknown as ToolOne[])
    })

    // Disconnect from DB
    await step.run("disconnect-from-db", async () => {
      return await db.$disconnect()
    })
  },
)
