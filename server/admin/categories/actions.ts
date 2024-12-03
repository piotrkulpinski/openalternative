"use server"

import { slugify } from "@curiousleaf/utils"
import { unstable_expireTag as expireTag } from "next/cache"
import { z } from "zod"
import { authedProcedure } from "~/lib/safe-actions"
import { categorySchema } from "~/server/admin/categories/validations"
import { prisma } from "~/services/prisma"

export const createCategory = authedProcedure
  .createServerAction()
  .input(categorySchema)
  .handler(async ({ input: { tools, ...input } }) => {
    const category = await prisma.category.create({
      data: {
        ...input,
        slug: input.slug || slugify(input.name),

        tools: {
          create: tools?.map(id => ({
            tool: { connect: { id } },
          })),
        },
      },
    })

    expireTag("categories")

    return category
  })

export const updateCategory = authedProcedure
  .createServerAction()
  .input(categorySchema.extend({ id: z.string() }))
  .handler(async ({ input: { id, tools, ...input } }) => {
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...input,
        slug: input.slug || slugify(input.name),

        tools: {
          deleteMany: { categoryId: id },

          create: tools?.map(id => ({
            tool: { connect: { id } },
          })),
        },
      },
    })

    expireTag("categories", `category-${category.slug}`)

    return category
  })

export const updateCategories = authedProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()), data: categorySchema.partial() }))
  .handler(async ({ input: { ids, data } }) => {
    await prisma.category.updateMany({
      where: { id: { in: ids } },
      data,
    })

    expireTag("categories", "category")

    return true
  })

export const deleteCategories = authedProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    await prisma.category.deleteMany({
      where: { id: { in: ids } },
    })

    expireTag("categories")

    return true
  })
