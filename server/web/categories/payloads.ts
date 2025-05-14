import { Prisma, ToolStatus } from "@prisma/client"

export const categoryWithTools = Prisma.validator<Prisma.CategoryWhereInput>()({
  OR: [
    { tools: { some: { status: ToolStatus.Published } } },
    { subcategories: { some: { tools: { some: { status: ToolStatus.Published } } } } },
  ],
})

export const categoryOnePayload = Prisma.validator<Prisma.CategorySelect>()({
  id: true,
  name: true,
  slug: true,
  label: true,
  description: true,
  fullPath: true,
  parentId: true,
  subcategories: { where: categoryWithTools },
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
    where: categoryWithTools,
    select: {
      name: true,
      slug: true,
      fullPath: true,
    },
  },
})

export type CategoryOne = Prisma.CategoryGetPayload<{ select: typeof categoryOnePayload }>
export type CategoryMany = Prisma.CategoryGetPayload<{ select: typeof categoryManyPayload }>
export type CategoryManyNested = Prisma.CategoryGetPayload<{
  select: typeof categoryManyNestedPayload
}>
