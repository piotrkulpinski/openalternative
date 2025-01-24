"use server"

import { prisma } from "@openalternative/db"
import { createServerAction } from "zsa"

export type FilterOption = {
  id: string
  name: string
}

export type ToolFilters = {
  alternatives: FilterOption[]
  categories: FilterOption[]
  stacks: FilterOption[]
  topics: { id: string }[]
  licenses: FilterOption[]
}

export const getToolFilters = createServerAction().handler(async () => {
  try {
    const [alternatives, categories, stacks, topics, licenses] = await Promise.all([
      prisma.alternative.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      prisma.stack.findMany({
        where: { type: "Tool" },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      prisma.topic.findMany({
        orderBy: { slug: "asc" },
        select: { slug: true },
      }),
      prisma.license.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
    ])
    console.log(alternatives)

    return {
      success: true as const,
      data: {
        alternatives,
        categories,
        stacks,
        topics: topics.map((topic: { slug: string }) => ({ id: topic.slug })),
        licenses,
      } satisfies ToolFilters,
    }
  } catch (error) {
    console.error(error)
    return { success: false as const, error }
  }
})
