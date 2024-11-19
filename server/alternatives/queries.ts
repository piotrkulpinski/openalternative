import type { Prisma } from "@prisma/client"
import { alternativeManyPayload, alternativeOnePayload } from "~/server/alternatives/payloads"
import { prisma } from "~/services/prisma"

export const findAlternatives = async ({
  where,
  orderBy,
  ...args
}: Prisma.AlternativeFindManyArgs) => {
  return prisma.alternative.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { tool: { publishedAt: { lte: new Date() } } } }, ...where },
    include: alternativeManyPayload,
  })
}

export const findAlternativeSlugs = async ({
  where,
  orderBy,
  ...args
}: Prisma.AlternativeFindManyArgs) => {
  return prisma.alternative.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { tool: { publishedAt: { lte: new Date() } } } }, ...where },
    select: { slug: true },
  })
}

export const findUniqueAlternative = async ({ ...args }: Prisma.AlternativeFindUniqueArgs) => {
  return prisma.alternative.findUnique({
    ...args,
    include: alternativeOnePayload,
  })
}
