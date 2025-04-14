import { config } from "~/config"
import EmailAdminNewSubmission from "~/emails/admin/new-submission"
import EmailSubmissionExpedited from "~/emails/submission-expedited"
import { type EmailParams, sendEmails } from "~/lib/email"
import { inngest } from "~/services/inngest"

export const toolExpedited = inngest.createFunction(
  { id: "tool.expedited" },
  { event: "tool.expedited" },
  async ({ event, step, db }) => {
    const tool = await step.run("fetch-tool", async () => {
      return await db.tool.findUniqueOrThrow({ where: { slug: event.data.slug } })
    })

    // Send submission email to user and admin
    await step.run("send-expedited-emails", async () => {
      const adminTo = config.site.email
      const adminSubject = "New Expedited Listing Request"

      const emails: EmailParams[] = [
        {
          to: adminTo,
          subject: adminSubject,
          react: EmailAdminNewSubmission({ to: adminTo, tool }),
        },
      ]

      if (tool.submitterEmail) {
        const to = tool.submitterEmail
        const subject = `🙌 Thanks for submitting ${tool.name}!`

        emails.push({
          to,
          subject,
          react: EmailSubmissionExpedited({ to, tool }),
        })
      }

      return await sendEmails(emails)
    })
  },
)
