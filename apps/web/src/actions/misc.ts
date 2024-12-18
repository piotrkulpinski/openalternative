"use server"

import { prisma } from "@openalternative/db"
import { getPostTemplate, sendSocialPost } from "~/lib/socials"

export const testSocialPosts = async () => {
  const tool = await prisma.tool.findFirst({ where: { slug: "dub" } })

  if (tool) {
    const template = await getPostTemplate(tool)
    return sendSocialPost(template, tool)
  }
}
