"use server"

import { prisma } from "@openalternative/db"
import { z } from "zod"
import { getToolRepositoryData } from "~/lib/repositories"
import { authedProcedure } from "~/lib/safe-actions"
import { getPostTemplate, sendSocialPost } from "~/lib/socials"

export const testSocialPosts = authedProcedure
  .createServerAction()
  .input(z.object({ slug: z.string() }))
  .handler(async ({ input: { slug } }) => {
    const tool = await prisma.tool.findFirst({ where: { slug } })

    if (tool) {
      const template = await getPostTemplate(tool)
      return sendSocialPost(template, tool)
    }
  })

export const fetchRepository = authedProcedure
  .createServerAction()
  .input(z.object({ repository: z.string() }))
  .handler(async ({ input: { repository } }) => {
    const data = await getToolRepositoryData(repository)

    if (!data) return

    console.log(data)

    return prisma.tool.update({
      where: { repository },
      data,
    })
  })
