"use server"

import "server-only"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { categorySchema } from "~/app/(dashboard)/categories/_lib/validations"
import { authedProcedure } from "~/lib/safe-actions"
import { prisma } from "~/services/prisma"
import { getSlug } from "~/utils/helpers"

export const createCategory = authedProcedure
  .createServerAction()
  .input(categorySchema)
  .handler(async ({ input: { tools, ...input } }) => {
    const category = await prisma.category.create({
      data: {
        ...input,
        slug: input.slug || getSlug(input.name),

        tools: {
          create: tools?.map(id => ({
            tool: { connect: { id } },
          })),
        },
      },
    })

    revalidatePath("/categories")

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
        slug: input.slug || getSlug(input.name),

        tools: {
          deleteMany: { categoryId: id },

          create: tools?.map(id => ({
            tool: { connect: { id } },
          })),
        },
      },
    })

    revalidatePath("/categories")
    revalidatePath(`/categories/${category.id}`)

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

    revalidatePath("/categories")

    return true
  })

export const deleteCategories = authedProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    await prisma.category.deleteMany({
      where: { id: { in: ids } },
    })

    revalidatePath("/categories")

    return true
  })
