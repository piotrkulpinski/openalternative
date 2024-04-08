import { json, LoaderFunction } from "@remix-run/node"
import { toolOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"

export const loader: LoaderFunction = async () => {
  const tools = await prisma.tool
    .findMany({
      where: { isDraft: false },
      include: toolOnePayload,
    })
    .then((tools) =>
      tools.map((tool) => ({
        ...tool,
        alternatives: tool.alternatives.map((alternative) => alternative.alternative),
        categories: tool.categories.map((category) => category.category),
        languages: tool.languages.map((language) => language.language),
        topics: tool.topics.map((topic) => topic.topic),
      }))
    )

  return json(tools)
}
