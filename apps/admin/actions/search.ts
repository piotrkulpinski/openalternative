"use server"

import { generateSocialPost } from "~/lib/socials"
import { sendBlueskyPost } from "~/services/bluesky"
import { prisma } from "~/services/prisma"
import { sendTwitterPost } from "~/services/twitter"

export async function searchItems(query: string) {
  const [tools, alternatives, categories, licenses] = await Promise.all([
    prisma.tool.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      orderBy: { name: "asc" },
      take: 5,
    }),
    prisma.alternative.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      orderBy: { name: "asc" },
      take: 5,
    }),
    prisma.category.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      orderBy: { name: "asc" },
      take: 5,
    }),
    prisma.license.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      orderBy: { name: "asc" },
      take: 5,
    }),
  ])

  return {
    tools,
    alternatives,
    categories,
    licenses,
  }
}

export const sendOutSocialPost = async () => {
  const post = await generateSocialPost()

  if (post) {
    await sendTwitterPost(post)
    await sendBlueskyPost(post)
  }
}
