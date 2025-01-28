import { db } from "@openalternative/db"
import { type Prisma, ToolStatus } from "@openalternative/db/client"
import { cache } from "~/lib/cache"
import { stackManyPayload, stackOnePayload } from "~/server/web/stacks/payloads"

export const findStacks = cache(
  async ({ where, orderBy, ...args }: Prisma.StackFindManyArgs) => {
    return db.stack.findMany({
      ...args,
      orderBy: orderBy ?? [{ tools: { _count: "desc" } }, { name: "asc" }],
      where: { tools: { some: { status: ToolStatus.Published } }, ...where },
      select: stackManyPayload,
    })
  },
  ["stacks"],
)

export const findStackSlugs = async ({ where, orderBy, ...args }: Prisma.StackFindManyArgs) => {
  return db.stack.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findStackBySlug = (slug: string, { where, ...args }: Prisma.StackFindFirstArgs = {}) =>
  cache(
    async (slug: string) => {
      return db.stack.findFirst({
        ...args,
        where: { slug, ...where },
        select: stackOnePayload,
      })
    },
    ["stack", `stack-${slug}`],
  )(slug)
