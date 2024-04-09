import { json, LoaderFunction } from "@remix-run/node"
import { prisma } from "~/services.server/prisma"

export const loader: LoaderFunction = async () => {
  const tools = await prisma.tool
    .findMany({
      where: { isDraft: false },
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
    .then((tools) =>
      tools.map((tool) => ({
        ...tool,
        alternatives: tool.alternatives.map(({ alternative }) => alternative.name),
        categories: tool.categories.map(({ category }) => category.name),
        languages: tool.languages.map(({ language }) => language.name),
        topics: tool.topics.map(({ topic }) => topic.slug),
      }))
    )

  return json(tools)
}
