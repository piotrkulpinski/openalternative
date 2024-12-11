"use server"

import { getPostTemplate, sendSocialPost } from "~/lib/socials"
import { findRandomTool } from "~/server/web/tools/queries"

export const testSocialPosts = async () => {
  const tool = await findRandomTool()

  if (tool) {
    const template = await getPostTemplate(tool)
    return sendSocialPost(template, tool)
  }
}
