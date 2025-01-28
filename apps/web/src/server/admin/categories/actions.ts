"use server"

import { slugify } from "@curiousleaf/utils"
import { db } from "@openalternative/db"
import { revalidateTag } from "next/cache"
import { z } from "zod"
import { authedProcedure } from "~/lib/safe-actions"
import { categorySchema } from "~/server/admin/categories/validations"

export const createCategory = authedProcedure
  .createServerAction()
  .input(categorySchema)
  .handler(async ({ input: { tools, ...input } }) => {
    const category = await db.category.create({
      data: {
        ...input,
        slug: input.slug || slugify(input.name),
        tools: { connect: tools?.map(id => ({ id })) },
      },
    })

    revalidateTag("categories")

    return category
  })

export const updateCategory = authedProcedure
  .createServerAction()
  .input(categorySchema.extend({ id: z.string() }))
  .handler(async ({ input: { id, tools, ...input } }) => {
    const category = await db.category.update({
      where: { id },
      data: {
        ...input,
        slug: input.slug || slugify(input.name),
        tools: { set: tools?.map(id => ({ id })) },
      },
    })

    revalidateTag("categories")
    revalidateTag(`category-${category.slug}`)

    return category
  })

export const updateCategories = authedProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()), data: categorySchema.partial() }))
  .handler(async ({ input: { ids, data } }) => {
    await db.category.updateMany({
      where: { id: { in: ids } },
      data,
    })

    revalidateTag("categories")
    revalidateTag("category")

    return true
  })

export const deleteCategories = authedProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    await db.category.deleteMany({
      where: { id: { in: ids } },
    })

    revalidateTag("categories")

    return true
  })
