"use server"

import { getRandomString, slugify } from "@primoui/utils"
import { revalidatePath, revalidateTag } from "next/cache"
import { z } from "zod"
import { getCategoryPath } from "~/lib/categories"
import { adminProcedure } from "~/lib/safe-actions"
import { categorySchema } from "~/server/admin/categories/schema"
import { db } from "~/services/db"

export const upsertCategory = adminProcedure
  .createServerAction()
  .input(categorySchema.extend({ id: z.string().optional() }))
  .handler(async ({ input: { id, tools, ...input } }) => {
    const isUpdate = !!id
    const toolIds = tools?.map(id => ({ id }))
    const slug = input.slug || slugify(input.name)

    if (isUpdate) {
      const oldCategory = await db.category.findUniqueOrThrow({
        where: { id },
      })

      const category = await db.category.update({
        where: { id },
        data: {
          ...input,
          slug,
          tools: { set: toolIds },
        },
      })

      // If the category has been moved, update the fullPath of all its descendants
      if (oldCategory.slug !== category.slug || oldCategory.parentId !== category.parentId) {
        const categories = await db.category.findMany({
          where: { fullPath: { startsWith: oldCategory.slug } },
        })

        await Promise.all(
          categories.map(async category => {
            await db.category.update({
              where: { id: category.id },
              data: { fullPath: await getCategoryPath(category) },
            })
          }),
        )
      }

      revalidateTag("categories")
      revalidateTag(`category-${category.slug}`)

      return category
    }

    const category = await db.category.create({
      data: {
        ...input,
        slug,
        fullPath: getRandomString(10), // Random temporary fullPath to avoid conflicts
        tools: { connect: toolIds },
      },
    })

    // Set the fullPath based on the category tree path
    await db.category.update({
      where: { id: category.id },
      data: { fullPath: await getCategoryPath(category) },
    })

    revalidateTag("categories")

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
