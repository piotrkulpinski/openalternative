import { ToolStatus } from "@openalternative/db/client"
import EmailSubmission from "~/emails/submission"
import { sendEmails } from "~/lib/email"
import { inngest } from "~/services/inngest"
import { ensureFreeSubmissions } from "~/utils/functions"

export const toolSubmitted = inngest.createFunction(
  { id: "tool.submitted" },
  { event: "tool.submitted" },
  async ({ event, step, db }) => {
    const tool = await step.run("fetch-tool", async () => {
      return await db.tool.findUniqueOrThrow({ where: { slug: event.data.slug } })
    })

    // Wait for 30 minutes for expedited or featured event
    const isFreeSubmission = await ensureFreeSubmissions(step, event.data.slug, "30m")

    // Send submission email to user if it's a free submission
    if (isFreeSubmission) {
      const queueLength = await step.run("get-queue-length", async () => {
        return await db.tool.count({
          where: { status: { in: [ToolStatus.Draft, ToolStatus.Scheduled] } },
        })
      })

      await step.run("send-submission-email", async () => {
        if (!tool.submitterEmail) return

        const to = tool.submitterEmail
        const subject = `🙌 Thanks for submitting ${tool.name}!`

        return await sendEmails({
          to,
          subject,
          react: EmailSubmission({ to, tool, queueLength }),
        })
      })
    }
  },
)
