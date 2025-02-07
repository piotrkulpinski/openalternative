import { db } from "@openalternative/db"
import { type Prisma, ToolStatus } from "@openalternative/db/client"
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"
import { stackManyPayload, stackOnePayload } from "~/server/web/stacks/payloads"

export const findStacks = async ({ where, orderBy, ...args }: Prisma.StackFindManyArgs) => {
  "use cache"

  cacheTag("stacks")
  cacheLife("max")

  return db.stack.findMany({
    ...args,
    orderBy: orderBy ?? [{ tools: { _count: "desc" } }, { name: "asc" }],
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: stackManyPayload,
  })
}

export const findStackSlugs = async ({ where, orderBy, ...args }: Prisma.StackFindManyArgs) => {
  "use cache"

  cacheTag("stacks")
  cacheLife("max")

  return db.stack.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findStack = async ({ ...args }: Prisma.StackFindFirstArgs = {}) => {
  "use cache"

  cacheTag("stack", `stack-${args.where?.slug}`)
  cacheLife("max")

  return db.stack.findFirst({
    ...args,
    select: stackOnePayload,
  })
}
