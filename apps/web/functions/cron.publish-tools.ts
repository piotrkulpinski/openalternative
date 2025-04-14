import { ToolStatus } from "@openalternative/db/client"
import { NonRetriableError } from "inngest"
import { revalidateTag } from "next/cache"
import { config } from "~/config"
import EmailToolPublished from "~/emails/tool-published"
import { sendEmails } from "~/lib/email"
import { getPostLaunchTemplate, sendSocialPost } from "~/lib/socials"
import { inngest } from "~/services/inngest"

export const publishTools = inngest.createFunction(
  { id: "publish-tools" },
  { cron: "TZ=Europe/Warsaw 5 0,12 * * *" }, // Every 12 hours at minute 5 (00:05 and 12:05)
  async ({ step, db, logger }) => {
    const tools = await step.run("fetch-tools", async () => {
      return await db.tool.findMany({
        where: {
          status: ToolStatus.Scheduled,
          publishedAt: { lte: new Date() },
        },
      })
    })

    if (tools.length) {
      logger.info(`Publishing ${tools.length} tools`, { tools })

      for (const tool of tools) {
        // Update tool status
        await step.run(`update-tool-status-${tool.slug}`, async () => {
          const updatedTool = await db.tool.update({
            where: { id: tool.id },
            data: { status: ToolStatus.Published },
          })

          // Revalidate cache
          revalidateTag(`tool-${tool.slug}`)

          return updatedTool
        })

        // Run steps in parallel
        await Promise.all([
          // Revalidate cache
          step.run("revalidate-cache", async () => {
            revalidateTag("tools")
            revalidateTag("schedule")
          }),

          // Post on socials
          step.run(`post-on-socials-${tool.slug}`, async () => {
            const template = getPostLaunchTemplate(tool)

            return await sendSocialPost(template, tool).catch(err => {
              console.error(err)
              throw new NonRetriableError(err.message)
            })
          }),

          // Send email
          step.run(`send-email-${tool.slug}`, async () => {
            if (!tool.submitterEmail) return

            const to = tool.submitterEmail
            const subject = `${tool.name} has been published on ${config.site.name} 🎉`

            return await sendEmails({
              to,
              subject,
              react: EmailToolPublished({ to, tool }),
            })
          }),
        ])
      }
    }

    // Cleanup expired claims
    await step.run("cleanup-claims", async () => {
      await db.claim.deleteMany({
        where: { expiresAt: { lte: new Date() } },
      })
    })

    // Disconnect from DB
    await step.run("disconnect-from-db", async () => {
      return await db.$disconnect()
    })
  },
)
