import { prisma } from "@openalternative/db"
import EmailSubmission from "~/emails/submission"
import { sendEmails } from "~/lib/email"
import { inngest } from "~/services/inngest"

export const toolSubmitted = inngest.createFunction(
  { id: "tool.submitted" },
  { event: "tool.submitted" },
  async ({ event, step }) => {
    const tool = await step.run("fetch-tool", async () => {
      return await prisma.tool.findUniqueOrThrow({ where: { slug: event.data.slug } })
    })

    // Wait for 30 minutes for expedited or featured event
    const isPremiumSubmission = await Promise.all([
      step.waitForEvent("wait-for-expedited", {
        event: "tool.expedited",
        timeout: "30m",
        match: "data.slug",
      }),

      step.waitForEvent("wait-for-featured", {
        event: "tool.featured",
        timeout: "30m",
        match: "data.slug",
      }),
    ])

    // Send submission email to user if not expedited
    if (!isPremiumSubmission) {
      await step.run("send-submission-email", async () => {
        if (!tool.submitterEmail) return

        const to = tool.submitterEmail
        const subject = `🙌 Thanks for submitting ${tool.name}!`

        return await sendEmails({ to, subject, react: EmailSubmission({ tool, to, subject }) })
      })
    }
  },
)
