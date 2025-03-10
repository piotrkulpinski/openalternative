"use server"

import { db } from "@openalternative/db"
import { ToolStatus } from "@openalternative/db/client"
import { addDays, differenceInDays } from "date-fns"
import { createServerAction } from "zsa"
import EmailToolExpediteDeal from "~/emails/tool-expedite-deal"
import { sendEmails } from "~/lib/email"

export const sendExpediteEmailsCommand = createServerAction().handler(async () => {
  try {
    const tools = await db.tool.findMany({
      where: {
        AND: [
          { status: ToolStatus.Scheduled },
          { publishedAt: { gte: addDays(new Date(), 14) } },
          { AND: [{ submitterEmail: { not: null } }, { submitterEmail: { not: "" } }] },
        ],
      },
    })

    if (tools.length === 0) {
      return { success: false, message: "No tools found in the waiting queue" }
    }

    const queueLength = await db.tool.count({
      where: { status: { in: [ToolStatus.Draft, ToolStatus.Scheduled] } },
    })

    await sendEmails(
      tools.map(tool => {
        const queue = differenceInDays(tool.publishedAt!, new Date())
        const to = tool.submitterEmail!
        const subject = `Skip the ${queue}-day queue for ${tool.name} (only 25 spots) 🚀`
        const react = EmailToolExpediteDeal({ to, subject, tool, queueLength })

        return { to, subject, react }
      }),
    )

    return {
      success: true,
      message: `Successfully sent ${tools.length} expedite emails`,
      toolsSent: tools.map(t => t.slug),
    }
  } catch (error) {
    console.error("Error sending expedite emails:", error)
    return { success: false, message: "Failed to send expedite emails" }
  }
})
