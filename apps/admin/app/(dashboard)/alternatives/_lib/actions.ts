"use server"

import type { Alternative, Prisma } from "@openalternative/db"
import { tasks } from "@trigger.dev/sdk/v3"
import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { getErrorMessage } from "~/lib/handle-error"
import { prisma } from "~/services/prisma"
import type { alternativeCreatedTask } from "~/trigger/alternative-created"
import type { alternativeDeletedTask } from "~/trigger/alternative-deleted"

export async function createAlternative(input: Prisma.AlternativeCreateInput) {
  noStore()
  try {
    const alternative = await prisma.alternative.create({
      data: input,
    })

    // Revalidate the alternatives page
    revalidatePath("/alternatives")

    // Trigger the background task
    await tasks.trigger<typeof alternativeCreatedTask>("alternative-created", alternative)

    return {
      data: alternative,
      error: null,
    }
  } catch (err) {
    console.error(err)

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
    console.error(err)

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
    console.error(err)

    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteAlternative(input: { id: Alternative["id"] }) {
  await deleteAlternatives({ ids: [input.id] })
}

export async function deleteAlternatives(input: { ids: Alternative["id"][] }) {
  try {
    const alternatives = await prisma.alternative.findMany({
      where: { id: { in: input.ids } },
    })

    await prisma.alternative.deleteMany({
      where: { id: { in: input.ids } },
    })

    revalidatePath("/alternatives")

    // Trigger the background task
    for (const alternative of alternatives) {
      await tasks.trigger<typeof alternativeDeletedTask>("alternative-deleted", alternative)
    }

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    console.error(err)

    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
