import { db } from "@openalternative/db"
import { type Prisma, ToolStatus } from "@openalternative/db/client"
import { cache } from "~/lib/cache"
import { categoryManyPayload, categoryOnePayload } from "~/server/web/categories/payloads"

export const findCategories = cache(
  async ({ where, orderBy, ...args }: Prisma.CategoryFindManyArgs) => {
    return db.category.findMany({
      ...args,
      orderBy: orderBy ?? { name: "asc" },
      where: { tools: { some: { status: ToolStatus.Published } }, ...where },
      select: categoryManyPayload,
    })
  },
  ["categories"],
)

export const findCategorySlugs = async ({
  where,
  orderBy,
  ...args
}: Prisma.CategoryFindManyArgs) => {
  return db.category.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findCategoryBySlug = (
  slug: string,
  { where, ...args }: Prisma.CategoryFindFirstArgs = {},
) =>
  cache(
    async (slug: string) => {
      return db.category.findFirst({
        ...args,
        where: { slug, ...where },
        select: categoryOnePayload,
      })
    },
    ["category", `category-${slug}`],
  )(slug)
