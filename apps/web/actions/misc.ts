"use server"

import { db } from "@openalternative/db"
import { ToolStatus } from "@openalternative/db/client"
import { addDays, differenceInDays } from "date-fns"
import { z } from "zod"
import EmailToolExpediteDeal from "~/emails/tool-expedite-deal"
import { sendEmails } from "~/lib/email"
import { adminProcedure } from "~/lib/safe-actions"
import { getPostTemplate, sendSocialPost } from "~/lib/socials"

export const testSocialPosts = adminProcedure
  .createServerAction()
  .input(z.object({ slug: z.string() }))
  .handler(async ({ input: { slug } }) => {
    const tool = await db.tool.findFirst({ where: { slug } })

    if (tool) {
      const template = await getPostTemplate(tool)
      return sendSocialPost(template, tool)
    }
  })

export const sendExpediteDealEmails = adminProcedure.createServerAction().handler(async () => {
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

  return await sendEmails(
    tools.map(tool => {
      const queue = differenceInDays(tool.publishedAt!, new Date())
      const to = tool.submitterEmail!
      const subject = `Skip the ${queue}-day queue for ${tool.name} (only 25 spots) 🚀`
      const react = EmailToolExpediteDeal({ to, subject, tool, queueLength })

      return { to, subject, react }
    }),
  )
})
