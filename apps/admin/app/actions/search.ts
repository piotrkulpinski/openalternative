"use server"

import { prisma } from "~/services/prisma"

export async function searchItems(query: string) {
  const [tools, alternatives, categories, licenses] = await Promise.all([
    prisma.tool.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      take: 5,
    }),
    prisma.alternative.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      take: 5,
    }),
    prisma.category.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      take: 5,
    }),
    prisma.license.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
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
