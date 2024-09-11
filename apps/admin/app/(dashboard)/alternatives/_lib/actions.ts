"use server"

import type { Alternative, Prisma } from "@openalternative/db"
import slugify from "@sindresorhus/slugify"
import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { getErrorMessage } from "~/lib/handle-error"
import { prisma } from "~/services/prisma"

export async function createAlternative(input: Prisma.AlternativeCreateInput) {
  noStore()
  try {
    const alternative = await prisma.alternative.create({
      data: {
        ...input,
        slug: slugify(input.name),
      },
    })

    revalidatePath("/alternatives")

    return {
      data: alternative,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function updateAlternative(id: string, input: Prisma.AlternativeUpdateInput) {
  noStore()
  try {
    const alternative = await prisma.alternative.update({
      where: { id },
      data: input,
    })

    revalidatePath("/alternatives")

    return {
      data: alternative,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function updateAlternatives(input: {
  ids: Alternative["id"][]
  data: Prisma.AlternativeUpdateInput
}) {
  noStore()
  try {
    await prisma.alternative.updateMany({
      where: { id: { in: input.ids } },
      data: input.data,
    })

    revalidatePath("/alternatives")

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

export async function deleteAlternative(input: { id: Alternative["id"] }) {
  try {
    await prisma.alternative.delete({
      where: { id: input.id },
    })

    revalidatePath("/alternatives")
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteAlternatives(input: { ids: Alternative["id"][] }) {
  try {
    await prisma.alternative.deleteMany({
      where: { id: { in: input.ids } },
    })

    revalidatePath("/alternatives")

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

export async function getChunkedAlternatives(input: { chunkSize?: number } = {}) {
  try {
    const chunkSize = input.chunkSize ?? 1000

    const totalAlternatives = await prisma.alternative.count()
    const totalChunks = Math.ceil(totalAlternatives / chunkSize)

    let chunkedAlternatives: Alternative[] = []

    for (let i = 0; i < totalChunks; i++) {
      chunkedAlternatives = await prisma.alternative.findMany({
        take: chunkSize,
        skip: i * chunkSize,
      })
    }

    return {
      data: chunkedAlternatives,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
