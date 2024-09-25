"use server"

import { generateLaunchTweet } from "~/lib/generate-content"
import { prisma } from "~/services/prisma"

export const generateTweet = async () => {
  const where = { publishedAt: { not: null, lte: new Date() } }
  const count = await prisma.tool.count({ where })
  const skip = Math.floor(Math.random() * count)
  const tool = await prisma.tool.findFirstOrThrow({ where, skip })

  const tweet = await generateLaunchTweet(tool)
  console.log(tweet)
}
