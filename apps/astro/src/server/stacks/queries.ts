import { prisma } from "@openalternative/db"
import { type Prisma, ToolStatus } from "@openalternative/db/client"
import { stackManyPayload, stackOnePayload } from "~/server/stacks/payloads"

export const findStacks = async ({ where, orderBy, ...args }: Prisma.StackFindManyArgs) => {
  return prisma.stack.findMany({
    ...args,
    orderBy: orderBy ?? [{ tools: { _count: "desc" } }, { name: "asc" }],
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: stackManyPayload,
  })
}

export const findStackSlugs = async ({ where, orderBy, ...args }: Prisma.StackFindManyArgs) => {
  return prisma.stack.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findStackBySlug = (
  slug: string,
  { where, ...args }: Prisma.StackFindFirstArgs = {},
) => {
  return prisma.stack.findFirst({
    ...args,
    where: { slug, ...where },
    select: stackOnePayload,
  })
}
