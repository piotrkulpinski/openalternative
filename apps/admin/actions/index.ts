"use server"

import { env } from "~/env"
import { algoliaClient } from "~/services/algolia"
import { prisma } from "~/services/prisma"

export const indexSearch = async () => {
  const indexName = env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME

  const objects = await prisma.tool
    .findMany({
      where: { publishedAt: { lte: new Date() } },
      include: {
        alternatives: {
          orderBy: { alternative: { name: "asc" } },
          include: { alternative: { select: { name: true } } },
        },
        categories: {
          orderBy: { category: { name: "asc" } },
          include: { category: { select: { name: true } } },
        },
        languages: {
          orderBy: { percentage: "desc" },
          include: { language: { select: { name: true } } },
        },
        topics: {
          orderBy: { topic: { slug: "asc" } },
          include: { topic: { select: { slug: true } } },
        },
      },
    })
    .then(tools =>
      tools.map(tool => ({
        ...tool,
        alternatives: tool.alternatives.map(({ alternative }) => alternative.name),
        categories: tool.categories.map(({ category }) => category.name),
        languages: tool.languages.map(({ language }) => language.name),
        topics: tool.topics.map(({ topic }) => topic.slug),
      })),
    )

  // Clear the index
  await algoliaClient.clearObjects({ indexName })

  // Index the objects
  await algoliaClient.saveObjects({ indexName, objects })
}
