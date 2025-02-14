"use server"

import { db } from "@openalternative/db"
import { z } from "zod"
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
