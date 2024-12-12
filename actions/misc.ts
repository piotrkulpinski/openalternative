"use server"

import { getPostTemplate, sendSocialPost } from "~/lib/socials"
import { prisma } from "~/services/prisma"

export const testSocialPosts = async () => {
  const tool = await prisma.tool.findFirst({ where: { slug: "dub" } })

  if (tool) {
    const template = await getPostTemplate(tool)
    return sendSocialPost(template, tool)
  }
}
