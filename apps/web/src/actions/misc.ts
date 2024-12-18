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

export const convertExplicitToImplicit = async () => {
  // Convert AlternativeToTool relations
  const alternativeRelations = await prisma.alternativeToTool.findMany()

  await Promise.allSettled(
    alternativeRelations.map(({ toolId, alternativeId }) =>
      prisma.tool.update({
        where: { id: toolId },
        data: { alternatives: { connect: { id: alternativeId } } },
      }),
    ),
  )

  // Convert CategoryToTools relations
  const categoryRelations = await prisma.categoryToTools.findMany()
  await Promise.allSettled(
    categoryRelations.map(({ toolId, categoryId }) =>
      prisma.tool.update({
        where: { id: toolId },
        data: { categories: { connect: { id: categoryId } } },
      }),
    ),
  )

  // Convert TopicToTool relations
  const topicRelations = await prisma.topicToTool.findMany()
  await Promise.allSettled(
    topicRelations.map(({ toolId, topicSlug }) =>
      prisma.tool.update({
        where: { id: toolId },
        data: { topics: { connect: { slug: topicSlug } } },
      }),
    ),
  )

  return { success: true }
}
