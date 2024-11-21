import { config } from "~/config"
import EmailToolPublished from "~/emails/tool-published"
import { sendEmails } from "~/lib/email"
import { inngest } from "~/services/inngest"
import { prisma } from "~/services/prisma"

export const toolPublished = inngest.createFunction(
  { id: "tool.published" },
  { event: "tool.published" },
  async ({ event, step }) => {
    const tool = await step.run("fetch-tool", async () => {
      return prisma.tool.findUniqueOrThrow({ where: { slug: event.data.slug } })
    })

    await step.run("send-email", async () => {
      if (tool.submitterEmail) {
        const to = tool.submitterEmail
        const subject = `${tool.name} has been published on ${config.site.name} 🎉`

        return sendEmails({
          to,
          subject,
          react: EmailToolPublished({ tool, to, subject }),
        })
      }
    })
  },
)
