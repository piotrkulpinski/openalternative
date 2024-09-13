"use server"

import type { Category, Prisma } from "@openalternative/db"
import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { getErrorMessage } from "~/lib/handle-error"
import { prisma } from "~/services/prisma"

export async function createCategory(input: Prisma.CategoryCreateInput) {
  noStore()
  try {
    const category = await prisma.category.create({
      data: input,
    })

    revalidatePath("/categories")

    return {
      data: category,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function updateCategory(id: string, input: Prisma.CategoryUpdateInput) {
  noStore()
  try {
    const category = await prisma.category.update({
      where: { id },
      data: input,
    })

    revalidatePath("/categories")

    return {
      data: category,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function updateCategories(input: {
  ids: Category["id"][]
  data: Prisma.CategoryUpdateInput
}) {
  noStore()
  try {
    await prisma.category.updateMany({
      where: { id: { in: input.ids } },
      data: input.data,
    })

    revalidatePath("/categories")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteCategory(input: { id: Category["id"] }) {
  try {
    await prisma.category.delete({
      where: { id: input.id },
    })

    revalidatePath("/categories")
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteCategories(input: { ids: Category["id"][] }) {
  try {
    await prisma.category.deleteMany({
      where: { id: { in: input.ids } },
    })

    revalidatePath("/categories")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function getChunkedCategories(input: { chunkSize?: number } = {}) {
  try {
    const chunkSize = input.chunkSize ?? 1000

    const totalCategories = await prisma.category.count()
    const totalChunks = Math.ceil(totalCategories / chunkSize)

    let chunkedCategories: Category[] = []

    for (let i = 0; i < totalChunks; i++) {
      chunkedCategories = await prisma.category.findMany({
        take: chunkSize,
        skip: i * chunkSize,
      })
    }

    return {
      data: chunkedCategories,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
