import { Prisma, ToolStatus } from "@openalternative/db/client"

export const categoryOnePayload = Prisma.validator<Prisma.CategorySelect>()({
  name: true,
  slug: true,
  label: true,
  description: true,
  fullPath: true,
  parentId: true,
  _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
})

export const categoryManyPayload = Prisma.validator<Prisma.CategorySelect>()({
  name: true,
  slug: true,
  label: true,
  fullPath: true,
  _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
})

export const categoryManyNestedPayload = Prisma.validator<Prisma.CategorySelect>()({
  name: true,
  slug: true,
  fullPath: true,
  subcategories: {
    select: {
      name: true,
      slug: true,
      fullPath: true,
      subcategories: {
        select: {
          name: true,
          slug: true,
          fullPath: true,
          _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
        },
      },
    },
  },
})

export type CategoryOne = Prisma.CategoryGetPayload<{ select: typeof categoryOnePayload }>
export type CategoryMany = Prisma.CategoryGetPayload<{ select: typeof categoryManyPayload }>
export type CategoryManyNested = Prisma.CategoryGetPayload<{
  select: typeof categoryManyNestedPayload
}>
