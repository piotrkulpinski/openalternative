import { json } from "@remix-run/node"
import {
  alternativeManyPayload,
  categoryManyPayload,
  languageManyPayload,
  topicManyPayload,
} from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"

export const loader = async () => {
  const [alternatives, categories, languages, topics] = await Promise.all([
    prisma.alternative.findMany({
      orderBy: { tools: { _count: "desc" } },
      include: alternativeManyPayload,
      take: 200,
    }),
    prisma.category.findMany({
      orderBy: { tools: { _count: "desc" } },
      include: categoryManyPayload,
      take: 200,
    }),
    prisma.language.findMany({
      orderBy: { tools: { _count: "desc" } },
      include: languageManyPayload,
      take: 200,
    }),
    prisma.topic.findMany({
      orderBy: { tools: { _count: "desc" } },
      include: topicManyPayload,
      take: 200,
    }),
  ])

  return json({ alternatives, categories, languages, topics }, JSON_HEADERS)
}
