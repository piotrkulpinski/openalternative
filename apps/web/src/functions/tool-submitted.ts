import { prisma } from "@openalternative/db"
import type { createStepTools } from "inngest/components/InngestStepTools"
import EmailSubmission from "~/emails/submission"
import { sendEmails } from "~/lib/email"
import { inngest } from "~/services/inngest"
import { waitForPremiumSubmission } from "~/utils/functions"

const isPremiumSubmission = async (
  step: ReturnType<typeof createStepTools<typeof inngest>>,
  timeout: string,
) => {
  return await Promise.all([
    step.waitForEvent("wait-for-expedited", {
      event: "tool.expedited",
      match: "data.slug",
      timeout,
    }),

    step.waitForEvent("wait-for-featured", {
      event: "tool.featured",
      match: "data.slug",
      timeout,
    }),
  ])
}

export const toolSubmitted = inngest.createFunction(
  { id: "tool.submitted" },
  { event: "tool.submitted" },
  async ({ event, step }) => {
    const tool = await step.run("fetch-tool", async () => {
      return await prisma.tool.findUniqueOrThrow({ where: { slug: event.data.slug } })
    })

    // Wait for 30 minutes for expedited or featured event
    const isPremiumSubmission = await waitForPremiumSubmission(step, "30m")

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
