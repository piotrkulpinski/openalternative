"use server"

import { slugify } from "@curiousleaf/utils"
import { db } from "@openalternative/db"
import { revalidatePath, revalidateTag } from "next/cache"
import { z } from "zod"
import { adminProcedure } from "~/lib/safe-actions"
import { categorySchema } from "~/server/admin/categories/schemas"

export const createCategory = adminProcedure
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

export const updateCategory = adminProcedure
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

export const deleteCategories = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    await db.category.deleteMany({
      where: { id: { in: ids } },
    })

    revalidatePath("/admin/categories")
    revalidateTag("categories")

    return true
  })
