import { ToolStatus } from "@prisma/client"
import { revalidateTag } from "next/cache"
import { config } from "~/config"
import EmailToolPublished from "~/emails/tool-published"
import { sendEmails } from "~/lib/email"
import { generateLaunchPost } from "~/lib/generate-content"
import { sendBlueskyPost } from "~/services/bluesky"
import { inngest } from "~/services/inngest"
import { prisma } from "~/services/prisma"
import { sendTwitterPost } from "~/services/twitter"

export const publishTools = inngest.createFunction(
  { id: "publish-tools" },
  { cron: "TZ=Europe/Warsaw */30 * * * *" },
  async ({ step }) => {
    const tools = await step.run("fetch-tools", async () => {
      return prisma.tool.findMany({
        where: {
          status: ToolStatus.Scheduled,
          publishedAt: { lte: new Date() },
        },
      })
    })

    if (tools.length) {
      for (const tool of tools) {
        const { post } = await step.run(`generate-post-${tool.slug}`, async () => {
          return generateLaunchPost(tool)
        })

        // Post on socials
        await Promise.all([
          step.run(`post-to-twitter-${tool.slug}`, () => sendTwitterPost(post)),
          step.run(`post-to-bluesky-${tool.slug}`, () => sendBlueskyPost(post)),
        ])

        // Update tool status
        await step.run(`update-tool-status-${tool.slug}`, async () => {
          return prisma.tool.update({
            where: { id: tool.id },
            data: { status: ToolStatus.Published },
          })
        })

        // Send email
        await step.run(`send-email-${tool.slug}`, async () => {
          if (!tool.submitterEmail) return

          const to = tool.submitterEmail
          const subject = `${tool.name} has been published on ${config.site.name} 🎉`

          return sendEmails({
            to,
            subject,
            react: EmailToolPublished({ tool, to, subject }),
          })
        })
      }
    }

    // Disconnect from DB
    await step.run("disconnect-from-db", async () => {
      return prisma.$disconnect()
    })

    // Revalidate cache
    await step.run("revalidate-tags", async () => {
      revalidateTag("tools")

      for (const tool of tools) {
        revalidateTag(`tool-${tool.slug}`)
      }
    })
  },
)
