import { type Tool, ToolStatus } from "@prisma/client"
import { config } from "~/config"
import EmailAdminSubmissionPremium from "~/emails/admin-submission-premium"
import EmailSubmission from "~/emails/submission"
import EmailSubmissionPremium from "~/emails/submission-premium"
import EmailSubmissionPublished from "~/emails/submission-published"
import EmailSubmissionScheduled from "~/emails/submission-scheduled"
import { sendEmail } from "~/lib/email"
import { countSubmittedTools } from "~/server/web/tools/queries"

/**
 * Notify the submitter of a tool submission
 *
 * @param tool - The tool to notify the submitter of
 * @returns The email that was sent
 */
export const notifySubmitterOfToolSubmitted = async (tool: Tool) => {
  if (!tool.submitterEmail) {
    return
  }

  const to = tool.submitterEmail
  const subject = `🙌 Thanks for submitting ${tool.name}!`
  const queueLength = await countSubmittedTools({})

  return await sendEmail({
    to,
    subject,
    react: EmailSubmission({ to, tool, queueLength }),
  })
}

/**
 * Notify the submitter of a tool scheduled for publication
 *
 * @param tool - The tool to notify the submitter of
 * @returns The email that was sent
 */
export const notifySubmitterOfToolScheduled = async (tool: Tool) => {
  if (!tool.submitterEmail || !tool.publishedAt || tool.status !== ToolStatus.Scheduled) {
    return
  }

  const to = tool.submitterEmail
  const subject = `Great news! ${tool.name} is scheduled for publication on ${config.site.name} 🎉`

  return await sendEmail({
    to,
    subject,
    react: EmailSubmissionScheduled({ to, tool }),
  })
}

/**
 * Notify the submitter of a tool published
 *
 * @param tool - The tool to notify the submitter of
 * @returns The email that was sent
 */
export const notifySubmitterOfToolPublished = async (tool: Tool) => {
  if (!tool.submitterEmail || !tool.publishedAt || tool.status !== ToolStatus.Published) {
    return
  }

  const to = tool.submitterEmail
  const subject = `${tool.name} has been published on ${config.site.name} 🎉`

  return await sendEmail({
    to,
    subject,
    react: EmailSubmissionPublished({ to, tool }),
  })
}

/**
 * Notify the submitter of a premium tool
 *
 * @param tool - The tool to notify the submitter of
 * @returns The email that was sent
 */
export const notifySubmitterOfPremiumTool = async (tool: Tool) => {
  if (!tool.submitterEmail) {
    return
  }

  const to = tool.submitterEmail
  const subject = `🙌 Thank you for ${tool.isFeatured ? "featuring" : "expediting"} ${tool.name}!`

  return await sendEmail({
    to,
    subject,
    react: EmailSubmissionPremium({ to, tool }),
  })
}

/**
 * Notify the admin of a premium tool
 *
 * @param tool - The tool to notify the admin of
 * @returns The email that was sent
 */
export const notifyAdminOfPremiumTool = async (tool: Tool) => {
  const to = config.site.email
  const subject = `New tool ${tool.isFeatured ? "featured" : "expedited"}: ${tool.name}`

  return await sendEmail({
    to,
    subject,
    replyTo: tool.submitterEmail ?? undefined,
    react: EmailAdminSubmissionPremium({ to, tool }),
  })
}
