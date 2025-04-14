import { config } from "~/config"
import EmailAdminNewSubmission from "~/emails/admin/new-submission"
import EmailSubmissionExpedited from "~/emails/submission-expedited"
import { type EmailParams, sendEmails } from "~/lib/email"
import { inngest } from "~/services/inngest"

export const toolFeatured = inngest.createFunction(
  { id: "tool.featured" },
  { event: "tool.featured" },
  async ({ event, step, db }) => {
    const tool = await step.run("fetch-tool", async () => {
      return await db.tool.findUniqueOrThrow({ where: { slug: event.data.slug } })
    })

    // Send submission email to user and admin
    await step.run("send-featured-emails", async () => {
      const adminTo = config.site.email
      const adminSubject = "New Featured Listing Request"

      const emails: EmailParams[] = [
        {
          to: adminTo,
          subject: adminSubject,
          react: EmailAdminNewSubmission({ to: adminTo, tool }),
        },
      ]

      if (tool.submitterEmail) {
        const to = tool.submitterEmail
        const subject = `🙌 Thanks for featuring ${tool.name}!`

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
